const { MessageEmbed } = require("discord.js");
const data = require('../../config')
module.exports = {
     name: "esay",
     category: "moderation",
     run: async (client, message, args) => {
          if (!message.member.hasPermission("MANAGE_MESSAGES"))
               return message.reply("Sorry, you don't have permissions to use this!");
          message.delete()
          const sayMessage = args.join(" ");
          let esayEmbed = new Discord.MessageEmbed()
               .setColor("RANDOM")
               .setDescription(`${sayMessage}`)
               .setTimestamp();
          message.delete().catch(e => { });
          message.channel.send(esayEmbed);
     }
}
