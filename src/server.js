const { Client, Collection, MessageEmbed } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const client = new Client({
  disableEveryone: true
});
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
  const guild = client.guilds.cache.get("695278738018926632"); // Staff guild id 695278738018926632
  const report = require('./MM events/MM-report.js') // function for reports
  const partner = require('./MM events/MM-partner.js') // function for partnerships

  if (
    message.author.bot || // Return if author is a bot 
    message.content.startsWith(prefix) || // Return if the message starts with the prefix
    (message.guild && message.guild.id !== guild.id) // Return if the guild is incorrect
  )

    return;

  if (message.guild) {
    // Embed with staff members message
    const mg = new MessageEmbed()
      .setColor('GREEN')
      .setAuthor(message.author.tag, message.author.displayAvatarURL(), `https://discordapp.com/users/${message.author.id}`)
      .setDescription(message.content)
      .setFooter("Message recieved")
      .setTimestamp();

    // Send the user a message
    const array = message.channel.topic
    const id = array.split(' ')[2]

    if (isNaN(id)) {
      return
    }

    const sent = await client.users.cache
      .get(id)

      .send(mg) // Returns true if successfully sent
      .catch(() => {}); // Returns false if there's an error
    message.react(sent ? "✅" : "❌"); // React with the correct emoji
  } else if (!guild.channels.cache.some((ch) => ch.topic === 'Modmail channel ' + message.author.id + ' (Please do not change)')) {
    try {
      await message.react('✅')
      const channel = message.channel

      const ph1 = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('ModMail Menu')
        .setDescription('Welcome to modmail. This system is only to be used to contact staff members about reports, punishments, partnering with the server, recieve information about the servers socials, or contact server management. Missusing this will result in a punishment.')
        .addField('What is this?', 'If you\'re reporting a member respond with `report` below. If you\'re interested with partnering with the server respond with `partner`. If you\'re wanting to know more about the servers socials respond below with `socials`. If you\'re wanting to know more about the servers socials respond below with `management`')


      if (!openThread.has(message.author.id)) {
        openThread.set(message.author.id)
        channel.send(ph1).then(msg => {
          const filter = m => m.author.id === message.author.id;
          const channel = msg.channel;
          const collector = channel.createMessageCollector(filter, {
            time: 7200000
          })

          collector.on('collect', async message => {
            if (message.content === 'report') {
              console.log('file report')
              report(message, filter, guild, message.author, openThread)
            } else if (message.content === 'partner') {
              console.log('partnership')
              partner(message, filter, guild, message.author, openThread)
            } else if (message.content === 'socials') {
              console.log('social media')
              
              message.channel.send('Please write the extent of your message here. Try to include as much detalis as possible for easier communication')
            } else if (message.content === 'management') {
              console.log('management')

            }
          })
        })
      }
    } catch (err) {
      console.log(err)
    }
  }


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
  logchannel.send(le).then(msg => msg.delete({
    timeout: 30000
  }))
});

client.on("error", error => console.error(error));
client.login('NzA2MzAwMTQ2NTM0NTgwMjk1.XsSKeg.Kl4OdSPXRcrFR1K6ChbotCsfDBE');
