/* eslint-disable func-names */
/* eslint-disable no-useless-concat */
/* eslint-disable new-cap */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
const { MessageEmbed } = require("discord.js");
const data = require("../../database/models/snippet.js");

module.exports = {
  name: "snippet",
  category: "modmail",
  usage: "snippet",
  run: async (client, message, args) => {
    const condition = args[0];
    if (condition === "add") {
      // Used to add snippet
      let name;
      let snippet;
      console.log("add a snippet");
      if (args[1].charAt(0) === '"') {
        console.log("long name");
        // All the information to format snippet (IMPORTANT)
        const org = args.slice(1).join(" ");
        const dos = org.match(/".*"/g).join(" ");
        const tres = dos.replace('"', "");
        const quatro = tres.replace('"', "");
        const pepe = quatro.trim();
        const cinco = org.replace('"', "");
        const sies = cinco.replace('"', "");

        // Snippet information name and content
        snippet = sies.slice(pepe.length).trim();
        name = quatro;

        // Handaling the db
        let snip = await data.findOne({
          snippetName: name,
        });
        if (!snip) {
          // If there is no data with the same name
          snip = new data({
            snippetName: name,
            snippetContent: snippet,
            guild: message.guild.id,
          });
          // Save the snippet
          await snip.save().catch((err) => console.log(err));
          message.channel.send("Saved the snippet");
        } else {
          // Update the snippet
          snip.snippetName = name;
          snip.snippetContent = snippet;
          await snip.save().catch((err) => console.log(err));
          message.channel.send(`${name} has been succesfully updated`);
        }
      } else {
        name = args[1];
        snippet = args.slice(2).join(" ");
        console.log(name);
        console.log(snippet);
        let single = await data.findOne({
          snippetName: name,
        });
        if (!single) {
          // If there is no data with the same name
          single = new data({
            snippetName: name,
            snippetContent: snippet,
            guild: message.guild.id,
          });
          // Save the snippet
          await single.save().catch((err) => console.log(err));
          message.channel.send("Saved the snippet");
        } else {
          // Update the snippet
          single.snippetName = name;
          single.snippetContent = snippet;
          await single.save().catch((err) => console.log(err));
          message.channel.send(`${name} has been succesfully updated`);
        }
      }
    } else if (condition === "remove") {
      // Used to remove a snippet
      console.log("remove a snippet");
      const rem = await data.findOne({
        guild: message.guild.id,
        snippetName: args.slice(1).join(" "),
      });
      if (!rem) {
        message.channel.send("There seems to be no snippet with that name");
      } else {
        rem.deleteOne().catch((err) => console.log(err));
        message.channel.send("The snippet has succesfully been removed");
      }
    } else if (condition === "test") {
      // Used to see what a snippet looks like
      console.log("test a snippet");
      await data
        .findOne({
          snippetName: args.slice(1).join(" "),
        })
        .then((res) => {
          message.channel.send(res.snippetContent);
        });
    } else if (condition === "view") {
      console.log("view all");
      let sOut;
      data
        .find({
          guild: message.guild.id,
        })
        .then((res) => {
          if (res.length === 0) {
            sOut = "No snippets have been setup yet";
          } else {
            const sName = res.map((z) => z.snippetName);
            const sContent = res.map((x) => x.snippetContent);
            const sOutp = sContent.map(function (a, b) {
              // eslint-disable-next-line prettier/prettier
              return ["Name:" + ` **${sName[b]}**` + "\n" + "Snippet:" + ` ${a}`];
            });
            sOut = sOutp.join("\n\n");
          }
          const view = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("ModMail Snippets")
            .setDescription(sOut);

          message.channel.send(view);
        });
    } else {
      const modCat = [
        "714882756131160074",
        "714883352510857357",
        "714882834103533599",
        "714882905645514782",
      ];
      if (modCat.includes(message.channel.parentID)) {
        try {
          await data
            .findOne({
              snippetName: args.slice(0).join(" "),
            })
            .then(async (res) => {
              const array = message.channel.topic;
              const id = array.split(" ")[2];
              const user = client.users.cache.get(id);

              const embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL(),
                  `https://discordapp.com/users/${message.author.id}`
                )
                .setDescription(res.snippetContent)
                .setFooter("Message recieved")
                .setTimestamp();

              user.send(embed);
              message.channel
                .send("I have succesfully sent the message to the user")
                .then((msg) => {
                  msg.delete({ timeout: 5000 });
                });
            });
        } catch (err) {
          console.log(err);
        }
      }
    }
  },
};
