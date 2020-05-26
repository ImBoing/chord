const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "close",
  category: "modmail",
  usage: "close",
  run: async (client, message) => {
    const modCat = [
      "714882756131160074",
      "714883352510857357",
      "714882834103533599",
      "714882905645514782",
    ];
    if (modCat.includes(message.channel.parentID)) {
      const array = message.channel.topic;
      let id = array.split(" ")[2];
      id = id.replace("@", "");
      id = id.replace("<", "");
      id = id.replace(">", "");
      const user = client.users.cache.get(id);

      const close = new MessageEmbed()
        .setColor("RED")
        .setTitle("Thread Closed")
        .setDescription(
          `<@${message.author.id}> has closed this Mod-mail thread`
        )
        .setFooter("Replying will open another thread")
        .setTimestamp();

      user.send(close);

      const { channel } = message;
      channel.delete();
    }
  },
};
