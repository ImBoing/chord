const Discord = require("discord.js");
const data = require('../../config')
module.exports = {
  name: "kick",
  run: async (client, message, args) => {
    const logchannel = await message.guild.channels.cache.get(data.logChannel)
    let bUser = message.mentions.users.first() ? message.mentions.users.first().tag : client.users.fetch(args[0])
    if (!bUser) return message.channel.send("Could not find a user with that provided info :x:");
    let bReason = args.slice(1).join(" ")
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("You do not have the correct permissions :x:");
    if (bUser.hasPermission("KICK_MEMBERS")) return message.channel.send("The user you provided cannot be kicked :x:");
    if (!bReason) bReason = "no reason provided"
    bUser.kick({ reason: bReason }).then(() => {
      message.channel.send(`**${bUser.tag}** has been kicked for ${reason}`)
      let logban = new Discord.RichEmbed()
        .setDescription("User has been Kicked")
        .setColor(data.embedColor)
        .addField('Kicked User:', `${bUser}`)
        .addField("Kicked by:", `${message.author}`)
        .addField("In channel:", `${message.channel}`)
        .setTimestamp()
        .addField("Reason", bReason);
      logchannel.send(logban)
      bUser.send(banEmbed);
    })
  }

}