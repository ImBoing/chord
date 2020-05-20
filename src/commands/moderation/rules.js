const { MessageEmbed } = require("discord.js");
const data = require("../../config");

module.exports = {
  name: "rules",
  category: "moderation",
  run: async (client, message) => {
    const embed = new MessageEmbed().setDescription(data.serverRules);
    message.channel.send(embed);
  },
};
