const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "reply",
  category: "modmail",
  usage: "reply",
  run: async (client, message, args) => {
    const modCat = [
      "714882756131160074",
      "714883352510857357",
      "714882834103533599",
      "714882905645514782",
    ];
    if (modCat.includes(message.channel.parentID)) {
      const array = message.channel.topic;
      const id = array.split(" ")[2];
      const user = client.users.cache.get(id);
      const reply = args.slice(0).join(" ");

      const rep = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL(),
          `https://discordapp.com/users/${message.author.id}`
        )
        .setDescription(reply)
        .setFooter("Message recieved")
        .setTimestamp();

      await message.delete();
      user.send(rep);
      message.channel.send(rep);
    }
  },
};
