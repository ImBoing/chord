const { Client, Collection, MessageEmbed } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");

const client = new Client({
  disableEveryone: true,
});
const data = require("./config.js");
// const {
//   selfPromo,
//   serverAdvertising,
//   channelAdvertiseCheck,
//   channelPromoCheck,
// } = require("./functions");

client.categories = fs.readdirSync("./commands/");
client.commands = new Collection();
client.aliases = new Collection();

config({
  path: `${__dirname}/.env`,
});
["command"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

const connectDB = require("./database/connect.js");

connectDB();

const openThread = new Map();

client.on("message", async (message) => {
  if (message.author.bot) return;
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
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) command.run(client, message, args);
  }
  // --------- M O D M A I L --------- \\
  const guild = client.guilds.cache.get("695278738018926632"); // Staff guild id 695278738018926632
  const report = require("./MM events/MM-report.js"); // function for reports
  const partner = require("./MM events/MM-partner.js"); // function for partnerships
  const socials = require("./MM events/MM-socials.js"); // function for socials
  const management = require("./MM events/MM-management.js"); // function for management
  if (
    message.author.bot || // Return if author is a bot
    (message.guild && message.guild.id !== guild.id) // Return if the guild is incorrect
  )
    return;
  const staffGuild = client.guilds.cache.get("695278738018926632");
  if (message.channel.type !== "dm") {
    const thingCategory = [
      "714883352510857357",
      "714882756131160074",
      "714882834103533599",
      "714882905645514782",
    ];
    if (thingCategory.indexOf(message.channel.parentID) === -1) return;
    // Embed with staff members message
    if (!message.content.toLowerCase().startsWith("la!reply")) return;
    const mg = new MessageEmbed()
      .setColor("GREEN")
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL(),
        `https://discord.com/users/${message.author.id}`
      )
      .setDescription(message.content.toLowerCase().replace("la!reply", ""))
      .setFooter("Message received")
      .setTimestamp();

    // Send the user a message
    const array = message.channel.topic;
    let id = array.split(" ")[2];
    id = id.replace("@", "");
    id = id.replace("<", "");
    id = id.replace(">", "");

    if (isNaN(id)) {
      return;
    }

    const sent = await client.users.cache
      .get(id)

      .send(mg) // Returns true if successfully sent
      .catch(() => {
        /* empty */
      }); // Returns false if there's an error
    message.react(sent ? "✅" : "❌"); // React with the correct emoji
  } else if (
    !staffGuild.channels.cache.some(
      (ch) =>
        ch.topic ===
        `Mod-mail channel <@${message.author.id}> (Please do not change)`
    )
  ) {
    try {
      await message.react("✅");
      const { channel } = message;

      const ph1 = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Mod-mail Menu")
        .setDescription(
          "Welcome to Mod-mail. This system is only to be used to contact staff members about reports, punishments, partnering with the server, receive information about the servers socials, or contact server management. Misusing this will result in a punishment."
        )
        .addField(
          "What is this?",
          "If you're reporting a member respond with `report` below. If you're interested with partnering with the server respond with `partner`. If you're wanting to know more about the servers socials respond below with `socials`. If you're wanting to know more about the servers socials respond below with `management`"
        );

      if (!openThread.has(message.author.id)) {
        openThread.set(message.author.id);
        channel.send(ph1).then((msg) => {
          const filter = (m) => m.author.id === message.author.id;
          const collector = msg.channel.createMessageCollector(filter, {
            time: 7200000,
          });

          collector.on("collect", async (collectedMessage) => {
            if (collectedMessage.content.toLowerCase() === "report") {
              report(
                collectedMessage,
                filter,
                guild,
                collectedMessage.author,
                openThread
              );
            } else if (collectedMessage.content.toLowerCase() === "partner") {
              partner(
                collectedMessage,
                filter,
                guild,
                collectedMessage.author,
                openThread
              );
            } else if (collectedMessage.content.toLowerCase() === "socials") {
              socials(
                collectedMessage,
                filter,
                guild,
                collectedMessage.author,
                openThread
              );
            } else if (
              collectedMessage.content.toLowerCase() === "management"
            ) {
              management(
                collectedMessage,
                filter,
                guild,
                collectedMessage.author,
                openThread
              );
            }
          });
        });
      }
    } catch (err) {
      /* empty */
    }
  } else {
    const destination = staffGuild.channels.cache.find(
      (c) =>
        c.topic ===
        `Mod-mail channel <@${message.author.id}> (Please do not change)`
    );
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL(),
        `https://discordapp.com/users/${message.author.id}`
      )
      .setDescription(message.content)
      .setFooter("Message received")
      .setTimestamp();

    if (destination) {
      destination.send(embed);
      return message.react("✅");
    }

    message.react("❌");
  }

  // }}
});

client.on("guildMemberAdd", async (member) => {
  const logChannel = await member.guild.channels.cache.get(
    "691048751258927145"
  );
  const { guild } = member;
  const je = new MessageEmbed()
    .setTitle("A member has joined the server")
    .setColor(data.embedColor)
    .setDescription(`You are member number: ${guild.memberCount}`)
    .addField(
      `Welcome ${member.user.tag}`,
      `Please read <#691048732304867328> and <#691048734024532008>. Enjoy your stay!`
    );
  logChannel.send(je);
});

client.on("guildMemberRemove", async (member) => {
  const logChannel = await member.guild.channels.cache.get(
    "691048751258927145"
  );
  const { guild } = member;
  const le = new MessageEmbed()
    .setTitle("A member has left the server")
    .setColor(data.embedColor)
    .setDescription(`We now have ${guild.memberCount} members`)
    .addField(`Goodbye ${member.user.tag}`, `We hope you enjoyed your stay.`);
  logChannel.send(le).then((msg) =>
    msg.delete({
      timeout: 30000,
    })
  );
});

client.login("NzA2MzAwMTQ2NTM0NTgwMjk1.XsSKeg.Kl4OdSPXRcrFR1K6ChbotCsfDBE");
