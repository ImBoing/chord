const Discord = require("discord.js");
const data = require('../../config')
module.exports = {
    name: "ban",

    run: async (client, message, args) => {
        const logchannel = await message.guild.channels.cache.get(data.logChannel)
        let bUser = message.mentions.users.first() ? message.mentions.users.first().tag : client.users.fetch(args[0])
        if (!bUser) return message.channel.send("Could not find a user with that provided info :x:");
        let bReason = args.slice(1).join(" ")
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You do not have the correct permissions :x:");
        if (bUser.hasPermission("BAN_MEMBERS")) return message.channel.send("The user you provided cannot be banned :x:");
        if (!bReason) bReason = "no reason provided"
        bUser.ban({ reason: bReason }).then(() => {
            message.channel.send(`**${bUser.tag}** has been banned for ${reason}`)
            let logban = new Discord.RichEmbed()
                .setDescription("User has been Banned")
                .setColor(data.embedColor)
                .addField('Banned User:', `${bUser}`)
                .addField("Banned by:", `${message.author}`)
                .addField("In channel:", `${message.channel}`)
                .setTimestamp()
                .addField("Reason", bReason);
            logchannel.send(logban)
            bUser.send(banEmbed);
        })
    }

}