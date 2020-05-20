module.exports = {
  name: "say",
  category: "moderation",
  run: async (client, message, args) => {
    await message.delete();
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.reply("You do not have permission to use this :x:");
    const botMessage = args.join(" ");
    message.delete().catch();
    message.channel.send(botMessage);
  },
};
