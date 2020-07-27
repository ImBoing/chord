/* eslint-disable class-methods-use-this */
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../structures/BaseCommand.js');

module.exports = class Hello extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'reply',
      aliases: [],
      description: 'Reply to a user through a modmail thread',
      usage: 'reply (message)',
    });
  }

  async run(message, args) {
    const modCat = [
      '714882756131160074',
      '714883352510857357',
      '714882834103533599',
      '714882905645514782',
    ];
    if (modCat.includes(message.channel.parentID)) {
      const array = message.channel.topic;
      const id = array.split(' ')[2];
      const user = this.client.users.cache.get(id);
      const reply = args.slice(0).join(' ');

      const rep = new MessageEmbed()
        .setColor('GREEN')
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL(),
          `https://discordapp.com/users/${message.author.id}`,
        )
        .setDescription(reply)
        .setFooter('Message recieved')
        .setTimestamp();

      await message.delete();
      user.send(rep);
      await message.channel.send(rep);
    }
  }
};
