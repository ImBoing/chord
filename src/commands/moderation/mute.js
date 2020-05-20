module.exports = {
  name: "mute",
  category: "moderation",
  run: async (client, message) => {
    message.delete();
    return message.channel.send("Still under development");
    // const logchannel = message.guild.channels.find(
    //   (channel) => channel.name === "logs"
    // );
    // const reason = args.join(" ").slice(22);
    // if (message.member.hasPermission("KICK_MEMBERS")) {
    //   if (!message.mentions.users.size) {
    //     return message.reply("You need to tag a user in order to mute them!");
    //   } else {
    //     const role = message.guild.roles.find((r) => r.name === "mute");
    //     const taggedUser = message.mentions.users.first();
    //     const member = message.mentions.members.first();
    //     if (!role) {
    //       return message.channel.send("Couldn't find a role named mute");
    //     }
    //     member
    //       .addRole(role)
    //       .then(console.log(`Succesfully muted ${member}`))
    //       .catch(console.error);
    //     message.channel.send(`${member} has succesfully been muted`);
    //   }
    // } else {
    //   message.reply(`You need to have the ability to kick users`);
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
