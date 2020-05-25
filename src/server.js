const { Client, Collection, MessageEmbed } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const client = new Client({ disableEveryone: true });
const data = require('./config.js')
const { selfPromo, serverAdvertising, channelAdvertiseCheck, channelPromoCheck } = require('./functions')
client.categories = fs.readdirSync("./src/commands/");
client.commands = new Collection();
client.aliases = new Collection();

config({
  path: __dirname + "/.env"
});
["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

const connectDB = require('./database/connect.js');
connectDB()

const openThread = new Map()

client.on("message", async message => {
  if (message.author.bot) return
  // if (channelAdvertiseCheck(message.channel.id) || channelPromoCheck(message.channel.id)) {
  //   if (serverAdvertising(message.channel.id, message.content)) {
  //     let acm = new MessageEmbed()
  //       .setColor(data.embedColor)
  //       .addField(
  //         data.advertisingRulesMessage.field.header,
  //         data.advertisingRulesMessage.field.content
  //       )
  //       .setFooter(data.embedFooter);
  //     message.channel.send(acm).then(message => message.delete({ timeout: 30000 }))
  //   } else {
  //     if (channelAdvertiseCheck(message.channel.id)) {
  //       console.log('yetus fetus')
  //       await message.delete()
  //       try { message.author.send(data.adDeletedMessage) } catch{
  //         message.channel.send(data.adDeletedMessage)
  //       }
  //     }
  //   }
  //   if (selfPromo(message.channel.id, message.content)) {
  //     let acm = new MessageEmbed()
  //       .setColor(data.embedColor)
  //       .addField(
  //         data.selfPromoRulesMessage.field.header,
  //         data.selfPromoRulesMessage.field.content
  //       )
  //       .setFooter(data.embedFooter);
  //     message.channel.send(acm).then(message => message.delete({ timeout: 30000 }))
  //   }
  //   else {
  //     if (channelPromoCheck(message.channel.id)) {
  //       await message.delete()
  //       try { message.author.send(data.selfPromoDeletedMessage) } catch{
  //         message.channel.send(data.selfPromoDeletedMessage)
  //       }
  //     }
  //   }
  // }
  // else {
  const prefix = "la!";
  if (message.author.bot) return;
  if (message.content.startsWith(prefix)) {
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
// --------- M O D M A I L --------- \\
  const guild = client.guilds.cache.get("688454304792969267"); // Staff guild id 695278738018926632

  if (
    message.author.bot || // Return if author is a bot 
    message.content.startsWith(prefix) || // Return if the message starts with the prefix
    (message.guild && message.guild.id !== guild.id) || // Return if the guild is incorrect
    (message.guild) // Return if guild channel & channel parent is incorrect (&& message.channel.parentID !== "695300095075287081" || message.channel.parentID !== '695300275786874980' || message.channel.parentID !== '695300195063431179' || message.channel.parentID !== '695300449024344135' || message.channel.parentID !== '702479822877753385')
)
    return;

  if (openThread.has(message.author.id)) {
    console.log('in map')
  } else if (!openThread.has(message.author.id)) {
    console.log('not in map')
    openThread.set(message.author.id, message.author.id)
  }
  console.log(openThread.get(message.author.id))
  

  // }}
});

client.on("guildMemberAdd", async member => {
  const logchannel = await member.guild.channels.cache.get("691048751258927145");
  const guild = member.guild;
  let je = new MessageEmbed()
    .setTitle("A member has joined the server")
    .setColor(data.embedColor)
    .setDescription(`You are member number: ${guild.memberCount}`)
    .addField(
      `Welcome ${member.user.tag}`,
      `Please read <#691048732304867328> and <#691048734024532008>. Enjoy your stay!`
    );
  logchannel.send(je);
});

client.on("guildMemberRemove", async member => {
  const logchannel = await member.guild.channels.cache.get("691048751258927145");
  const guild = member.guild;
  let le = new MessageEmbed()
    .setTitle("A member has left the server")
    .setColor(data.embedColor)
    .setDescription(`We now have ${guild.memberCount} members`)
    .addField(`Goodbye ${member.user.tag}`, `We hope you enjoyed your stay.`);
  logchannel.send(le).then(msg => msg.delete({ timeout: 30000 }))
});

client.on("error", error => console.error(error));
client.login('NzA2MzAwMTQ2NTM0NTgwMjk1.XsSKeg.Kl4OdSPXRcrFR1K6ChbotCsfDBE');
