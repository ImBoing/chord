const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const data = require('../../config')
module.exports = {
  name: "warn",

  run: async (client, message, args) => {
    message.delete()
    const logchannel = await message.guild.channels.cache.get(data.warnChannel)
    let userToWarn = message.mentions.users.first() ? message.mentions.users.first().tag : client.users.fetch(args[0])
    if (!userToWarn) return message.reply("Could not find a user with that provided info :x:");
    let reason = args.slice(1).join(" ")
    if (!reason) { return await message.channel.send('Please provide a reason to why you are warning this user').then(m => m.delete({ timeout: 5000 })) } else {
      message.channel.send(`${userToWarn} has been warned for ${reason}`).then(m => m.delete({ timeout: 5000 }))
      let logwarn = new MessageEmbed()
        .setDescription("User Warned")
        .setColor(data.embedColor)
        .addField('Warned User:', `${userToWarn}`)
        .addField("Warned by:", `${message.author.tag}`)
        .addField("In channel:", `${message.channel}`)
        .addField("Reason", reason)
        .setTimestamp();
      logchannel.send(logwarn)
      try { userToWarn.send(`You have been warned in Lightning Ads for ${reason}`); } catch { }
    }
  }
}