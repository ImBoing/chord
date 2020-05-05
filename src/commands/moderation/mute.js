const Discord = require('discord.js');
const data = require('../../config')
module.exports = {
    name: "mute",

    run: async (client, message, args) => {
        message.delete();
        return message.channel.send('Still under development')
        const logchannel = message.guild.channels.find(channel => channel.name === "logs");
        let reason = args.join(" ").slice(22);
        if (message.member.hasPermission('KICK_MEMBERS')) {
            if (!message.mentions.users.size) {
                return message.reply('You need to tag a user in order to mute them!');
            } else {
                let role = message.guild.roles.find(r => r.name === "mute");
                const taggedUser = message.mentions.users.first();
                const member = message.mentions.members.first();
                if (!role) {
                    return message.channel.send("Couldn't find a role named mute")
                }
                member.addRole(role)
                    .then(console.log(`Succesfully muted ${member}`))
                    .catch(console.error);
                message.channel.send(`${member} has succesfully been muted`)
            }
        } else {
            message.reply(`You need to have the ability to kick users`)
        }
        const member = message.mentions.members.first();
        let kickEmbed = new Discord.MessageEmbed()
            .setDescription("Warn Log")
            .setColor("RANDOM")
            .addField("Warned by:", `${message.author}`)
            .addField("In server:", `${message.guild.name}`)
            .addField("Reason", reason);
        let logmute = new Discord.MessageEmbed()
            .setDescription("Ban Log")
            .setColor("RANDOM")
            .addField('Banned User:', `${member}`)
            .addField("Banned by:", `${message.author}`)
            .addField("In channel:", `${message.channel}`)
            .addField("Time", message.createdAt)
            .addField("Reason", reason);
        logchannel.send(logmute)
        member.send(kickEmbed);
    }
}
