const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "esay",
  category: "moderation",
  run: async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.reply("Sorry, you don't have permissions to use this!");
    message.delete();
    const sayMessage = args.join(" ");
    const sayEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`${sayMessage}`)
      .setTimestamp();
    message.delete().catch(() => {});
    message.channel.send(sayEmbed);
  },
};
