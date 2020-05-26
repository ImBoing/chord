module.exports = {
  name: "unmute",
  category: "moderation",
  run: async (client, message) => {
    return message.channel.send("Still under development");
    // const logchannel = message.guild.channels.find(
    //   (channel) => channel.name === "logs"
    // );
    // const reason = args.join(" ").slice(22);
    // message.delete();
    // if (message.member.hasPermission("KICK_MEMBERS")) {
    //   if (!message.mentions.users.size) {
    //     return message.reply("You need to tag a user in order to unmute them!");
    //   } else {
    //     const role = message.guild.roles.find((r) => r.name === "mute");
    //     const taggedUser = message.mentions.users.first();
    //     const member = message.mentions.members.first();
    //     member
    //       .removeRole(role)
    //       .then(console.log(`succesfully unmuted ${member}`))
    //       .catch(console.error);
    //     message.channel.send(`${member} has succesfully been unmuted`);
    //   }
    // } else {
    //   message.reply(`you need to have the ability to kick users`);
    // }
    // const member = message.mentions.members.first();
    // const kickEmbed = new Discord.MessageEmbed()
    //   .setDescription("Warn Log")
    //   .setColor("RANDOM")
    //   .addField("Warned by:", `${message.author}`)
    //   .addField("In server:", `${message.guild.name}`)
    //   .addField("Reason", reason);
    // const logmute = new Discord.MessageEmbed()
    //   .setDescription("Ban Log")
    //   .setColor("RANDOM")
    //   .addField("Banned User:", `${member}`)
    //   .addField("Banned by:", `${message.author}`)
    //   .addField("In channel:", `${message.channel}`)
    //   .addField("Time", message.createdAt)
    //   .addField("Reason", reason);
    // logchannel.send(logmute);
    // member.send(kickEmbed);
  },
};
