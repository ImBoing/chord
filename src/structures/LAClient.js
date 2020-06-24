const { Client, Collection, MessageEmbed } = require('discord.js');
const Util = require('./Utils.js');
const connectDB = require('../database/connect.js');

const openThread = new Map();

module.exports = class LAClient extends Client {
  constructor(options = {}) {
    super({
      disableMentions: 'everyone',
    });
    this.validate(options);

    this.commands = new Collection();

    this.aliases = new Collection();

    this.utils = new Util(this);

    this.once('ready', () => {
      connectDB();
      console.log(`Logged in as ${this.user.username}`);
    });

    this.on('message', async (message) => {
      const prefix = 'la!';
      if (message.author.bot) return;
      if (message.content.startsWith(prefix)) {
        const [...args] = message.content
          .slice(prefix.length)
          .trim()
          .split(/ +/g);
        const cmd = args.shift().toLowerCase();
        const command =
          this.commands.get(cmd.toLowerCase()) ||
          this.commands.get(this.aliases.get(cmd.toLowerCase()));

        if (command) {
          command.run(message, args);
        }
      }

      const guild = this.guilds.cache.get('695278738018926632');
      const report = require('../mm-events/mm-report.js');
      const partner = require('../mm-events/mm-partner.js');
      const socials = require('../mm-events/mm-socials.js');
      const management = require('../mm-events/mm-management.js');

      if (
        message.author.bot ||
        (message.guild && message.guild.id !== guild.id) ||
        message.guild
      )
        return;
      const staffGuild = this.guilds.cache.get('695278738018926632');
      if (
        !staffGuild.channels.cache.some(
          (ch) =>
            ch.topic ===
            `Mod-mail channel ${message.author.id} (Please do not change)`,
        )
      ) {
        try {
          await message.react('✅');
          const { channel } = message;

          const ph1 = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Mod-mail Menu')
            .setDescription(
              'Welcome to Mod-mail. This system is only to be used to contact staff members about reports, punishments, partnering with the server, receive information about the servers socials, or contact server management. Misusing this will result in a punishment.',
            )
            .addField(
              'What is this?',
              "If you're reporting a member respond with `report` below. If you're interested with partnering with the server respond with `partner`. If you're wanting to know more about the servers socials respond below with `socials`. If you're wanting to know more about the servers socials respond below with `management`",
            );

          if (!openThread.has(message.author.id)) {
            openThread.set(message.author.id);
            channel.send(ph1).then((msg) => {
              const filter = (m) => m.author.id === message.author.id;
              const collector = msg.channel.createMessageCollector(filter, {
                time: 7200000,
              });

              collector.on('collect', async (collectedMessage) => {
                if (collectedMessage.content.toLowerCase() === 'report') {
                  report(
                    collectedMessage,
                    filter,
                    guild,
                    collectedMessage.author,
                    openThread,
                    collector,
                  );
                } else if (
                  collectedMessage.content.toLowerCase() === 'partner'
                ) {
                  partner(
                    collectedMessage,
                    filter,
                    guild,
                    collectedMessage.author,
                    openThread,
                    collector,
                  );
                } else if (
                  collectedMessage.content.toLowerCase() === 'socials'
                ) {
                  socials(
                    collectedMessage,
                    filter,
                    guild,
                    collectedMessage.author,
                    openThread,
                    collector,
                  );
                } else if (
                  collectedMessage.content.toLowerCase() === 'management'
                ) {
                  management(
                    collectedMessage,
                    filter,
                    guild,
                    collectedMessage.author,
                    openThread,
                    collector,
                  );
                }
              });
              collector.on('end', () => {
                /* empty */
              });
            });
          }
        } catch (err) {
          /* empty */
        }
      } else {
        const destination = staffGuild.channels.cache.find(
          (c) =>
            c.topic ===
            `Mod-mail channel ${message.author.id} (Please do not change)`,
        );
        const embed = new MessageEmbed()
          .setColor('GREEN')
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL(),
            `https://discordapp.com/users/${message.author.id}`,
          )
          .setDescription(message.content)
          .setFooter('Message received')
          .setTimestamp();

        if (destination) {
          destination.send(embed);
          return message.react('✅');
        }

        message.react('❌');
      }
    });
  }

  validate(options) {
    if (typeof options !== 'object')
      throw new TypeError('Options should be a type of Object.');

    if (!options.token)
      throw new Error('You must pass the token for the client.');
    this.token = options.token;

    if (!options.prefix)
      throw new Error('You must pass a prefix for the client');
    if (typeof options.prefix !== 'string')
      throw new TypeError('Prefix should be a type of string');
    this.prefix = options.prefix;
  }

  async start(token = this.token) {
    this.utils.loadCommands();
    super.login(token);
  }
};
