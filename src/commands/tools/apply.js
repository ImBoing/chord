const { MessageEmbed } = require('discord.js');
const GenericCommand = require('../../structures/GenericCommand.js');

module.exports = class Help extends GenericCommand {
  constructor(...args) {
    super(...args, {
      name: 'apply',
      aliases: ['application', 'job'],
      description: 'Lists all the avaliable applications',
      usage: '{prefi}apply',
      category: 'tools',
    });
  }

  async run(message) {
    const embed = new MessageEmbed()
      .setColor('PURPLE')
      .addField(
        '**All avaliable applications**',
        '[Moderator](https://forms.gle/1Qbxyoc7ZKivTeW29)\n[Event Manager](https://forms.gle/1Qbxyoc7ZKivTeW29)\n[Public Relation](https://forms.gle/1Qbxyoc7ZKivTeW29)\n[Developer](https://forms.gle/o3QctQm1StegKgJY7)\n[Advertising Manager]( https://forms.gle/fY1tdob3TGFmvfgc7)\n[Partnership Manager (DM AC support)](https://discordapp.com/users/730466685420568619)',
      );

    message.channel.send(embed);
  }
};
