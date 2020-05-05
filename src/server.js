const { Client, Collection, MessageEmbed } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const client = new Client({ disableEveryone: true });
const data = require('./config.js')
const { selfPromo, serverAdvertising, channelAdvertiseCheck, channelPromoCheck } = require('./functions')
client.categories = fs.readdirSync("./commands/");
client.commands = new Collection();
client.aliases = new Collection();

config({
  path: __dirname + "/.env"
});
["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.on("message", async message => {
  if (message.author.bot) return
  if (channelAdvertiseCheck(message.channel.id) || channelPromoCheck(message.channel.id)) {
    if (serverAdvertising(message.channel.id, message.content)) {
      let acm = new MessageEmbed()
        .setColor(data.embedColor)
        .addField(
          data.advertisingRulesMessage.field.header,
          data.advertisingRulesMessage.field.content
        )
        .setFooter(data.embedFooter);
      message.channel.send(acm).then(message => message.delete({ timeout: 30000 }))
    } else {
      if (channelAdvertiseCheck(message.channel.id)) {
        console.log('yetus fetus')
        await message.delete()
        try { message.author.send(data.adDeletedMessage) } catch{
          message.channel.send(data.adDeletedMessage)
        }
      }
    }
    if (selfPromo(message.channel.id, message.content)) {
      let acm = new MessageEmbed()
        .setColor(data.embedColor)
        .addField(
          data.selfPromoRulesMessage.field.header,
          data.selfPromoRulesMessage.field.content
        )
        .setFooter(data.embedFooter);
      message.channel.send(acm).then(message => message.delete({ timeout: 30000 }))
    }
    else {
      if (channelPromoCheck(message.channel.id)) {
        await message.delete()
        try { message.author.send(data.selfPromoDeletedMessage) } catch{
          message.channel.send(data.selfPromoDeletedMessage)
        }
      }
    }
  }
  else {
    const prefix = "la!";
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) command.run(client, message, args);
  }
});

client.on("error", error => console.error(error));
client.login('NzA2MzAwMTQ2NTM0NTgwMjk1.Xq4PaQ.-kAr5_KwCfG7ULbdczTEXRPAwnc');
