const { Client, Collection } = require('discord.js');
const Util = require('./Utils.js');

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
      console.log(`Logged in as ${this.user.username}`);
    });

    this.on('message', async (message) => {
      const prefix = '$';
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
          if (command.perms && !message.member.hasPermission(command.perms)) {
            return message.channel.send(
              `You are missing the \`${command.perms[0]}\` permission. Make sure you have the required permissions before running the command again.`,
            );
          } else if (command.missingArgs && !args[0]) {
            return message.channel.send(command.missingArgs);
          } else {
            command.run(message, args);
          }
        }
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
