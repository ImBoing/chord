/* eslint-disable new-cap */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
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
    } else {
      await data
        .findOne({
          snippetName: args.slice(0).join(" "),
        })
        .then((res) => {
          console.log(res.snippetContent);
        });
    }

    // const uno = args.join(" ");
    // const dos = uno.match(/".*"/g).join(" ");
    // const tres = dos.replace('"', "");
    // const quatro = tres.replace('"', "");
    // const cinco = uno.slice(quatro.length + 3);
    // console.log(cinco);
  },
};
