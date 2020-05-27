const { MessageEmbed } = require("discord.js");

async function report(message, filter, guild, member, map) {
  let cont;
  await message.channel
    .send(
      "Please write the extent of your message here. Try to include as much details as possible for easier communication"
    )
    .then((sentMessage) => {
      const x = sentMessage.channel.createMessageCollector(filter);

      x.on("collect", async (msg) => {
        cont = msg.content;

        guild.channels
          .create(member.tag.replace("#", "-"), {
            topic: `Mod-mail channel ${member.id} (Please do not change)`,
            parent: "714882756131160074",
            permissionOverwrites: [
              {
                id: guild.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: "713624763775320066",
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              },
              {
                id: member.id,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              },
              {
                id: "712772128956612640",
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              },
            ],
          })
          .then(async (thread) => {
            const embed = new MessageEmbed()
              .setColor("GREEN")
              .setTitle("New Thread")
              .setDescription(
                "Commands that are not under the **ModMail** and are used in this channel will be ignored."
              )
              .setFooter(`User id: ${member.id}`);

            thread.send(embed);

            const content = new MessageEmbed()
              .setColor("GREEN")
              .setAuthor(
                member.tag,
                member.displayAvatarURL(),
                `https://discordapp.com/users/${member.id}`
              )
              .setDescription(cont)
              .setFooter("Message received")
              .setTimestamp();

            thread.send(content);
            x.stop();
          });
      });

      x.on("end", () => {
        member.send(
          "Your mail has been delivered. Be patient a staff member will get to you soon."
        );
        map.delete(member.id);
      });
    });
}

module.exports = report;
