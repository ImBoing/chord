const { MessageEmbed } = require("discord.js");
const data = require("../../config");

module.exports = {
  name: "ban",
  category: "moderation",
  run: async (client, message, args) => {
    message.delete();
    const logChannel = await message.guild.channels.cache.get(data.logChannel);
    const user = args[0];
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.channel.send("You cannot use this :x:");
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "no reason provided";
    message.guild.unban(user).catch(() => {});
    if (!user) return message.reply("Please provide a user ID");
    message.channel.send(`${user} has been unbanned for ${reason}`);
    const logBan = new MessageEmbed()
      .setDescription("User unbanned")
      .setColor(data.embedColor)
      .addField("Unbanned User:", `${user}`)
      .addField("Unbanned by:", `${message.author}`)
      .addField("In channel:", `${message.channel}`)
      .setTimestamp()
      .addField("Reason", reason);
    logChannel.send(logBan);
  },
};
