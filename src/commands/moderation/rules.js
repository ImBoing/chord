const { MessageEmbed } = require("discord.js");
const data = require('../../config')
module.exports = {
  name: "rules",

  run: async (client, message, args) => {
    const embed = new MessageEmbed().setDescription(data.serverRules)
    message.channel.send(embed)
  }
}
