const { MessageEmbed } = require('discord.js');

async function socials (message, filter, guild, member, map) {
  let cont;
  await message.channel.send('Please write the extent of your message here. Try to include as much detalis as possible for easier communication').then(message => {
    const x = message.channel.createMessageCollector(filter)

    x.on('collect', async msg => {
      cont = msg.content

      guild.channels
        .create(member.tag.replace('#', '-'), {
          topic: 'Modmail channel ' + member + ' (Please do not change)',
          parent: '714882905645514782',
          permissionOverwrites: [{
              id: guild.id,
              deny: ['VIEW_CHANNEL']
            },
            {
              id: '713625993587327050',
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            },
            {
              id: member.id,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            }
          ]
        })
        .then(async thread => {
          console.log('created channel')
          const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('New Thread')
            .setDescription('Commands that are not under the **ModMail** and are used in this channel will be ignored.')
            .setFooter(`User id: ${member.id}`)

          thread.send(embed)

          const content = new MessageEmbed()
            .setColor('GREEN')
            .setAuthor(member.tag, member.displayAvatarURL(), `https://discordapp.com/users/${member.id}`)
            .setDescription(cont)
            .setFooter('Message recieved')
            .setTimestamp()

          thread.send(content)
          x.stop()
        })
    })

    x.on('end', () => {
      member.send('Your mail has been delivered. Be patient a staff member will get to you soon.')
      map.delete(member.id)
    })
  })
}

module.exports = (socials)