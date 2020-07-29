const { MessageEmbed } = require('discord.js');
const GenericCommand = require('../../structures/GenericCommand.js');

module.exports = class Help extends GenericCommand {
  constructor(...args) {
    super(...args, {
      name: 'lookup',
      aliases: [],
      description: 'finds information about a guild or a user',
      usage: '{prefix}lookup',
      category: 'tools',
      missingArgs: 'Please provide a user ID or a guild invite link.',
    });
  }

  async run(message, args) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        (x) => x.user.username === args.slice(0).join(' '),
      );

    const guildLink = args[0].match(/https(:)\/\/discord.gg\/[a-zA-Z0-9]+/g);

    const verificationLevels = {
      NONE: 'None',
      LOW: 'Low (Need Verified Email)',
      MEDIUM: 'Medium (Registered on Discord for 5+ minutes)',
      HIGH: 'High (Need to wait 10 minutes)',
      VERY_HIGH: 'Very High (Need verified phone on account)',
    };

    const bot = {
      true: 'Bot',
      false: 'Human',
    };

    let embed;
    // let guildName;
    // let guildId;
    // let guildMemberCount;

    if (member) {
      console.log(member);
    } else if (guildLink) {
      this.client.fetchInvite(guildLink).then((invite) => {
        console.log(invite);
        embed = new MessageEmbed()
          .setColor('PURPLE')
          .setAuthor(invite.guild.name)
          .setTitle(`ID: ${invite.guild.id}`)
          .addField(
            'Verification Level',
            `${verificationLevels[invite.guild.verificationLevel]}`,
          )
          .addField('Code', `${invite.code}`, true)
          .addField('Inviter', `${invite.inviter.tag}`, true)
          .addField('User Type', `${bot[invite.inviter.bot]}`, true)
          .addField('Member Count', `${invite.memberCount}`)
          .addField('Channel ID', `${invite.channel.id}`);
        message.channel.send(embed);
        console.log(invite.guild.name);
      });

      //   message.channel.send(embed);
    } else {
      message.channel.send(this.missingArgs);
    }
  }
};
