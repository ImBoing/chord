const { MessageEmbed } = require('discord.js');
const data = require('../../config')
module.exports = {
  name: "ban",

  run: async (client, message, args) => {
    message.delete()
    const logchannel = await message.guild.channels.cache.get(data.logChannel)
    const user = args[0]
    if (!message.member.hasPermission('BAN_MEMBERS'))
      return message.channel.send("You cannot use this :x:")
    let reason = args.slice(1).join(' ');
    if (!reason) reason = 'no reason provided'
    message.guild.unban(user1).catch(err => { })
    if (!user1) return message.reply('Please provide a user ID')
    message.channel.send(`${user} has been unbanned for ${reason}`)
    let logban = new MessageEmbed()
      .setDescription("User unbanned")
      .setColor(data.embedColor)
      .addField('Unbanned User:', `${user1}`)
      .addField("Unbanned by:", `${message.author}`)
      .addField("In channel:", `${message.channel}`)
      .setTimestamp()
      .addField("Reason", reason);
    logchannel.send(logban)
  }
}