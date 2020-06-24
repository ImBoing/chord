/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-const */
/* eslint-disable prefer-template */
/* eslint-disable no-path-concat */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
const { Collection, MessageAttachment } = require("discord.js");
const fs = require("fs").promises;
const jsdom = require("jsdom");

const { JSDOM } = jsdom;
const dom = new JSDOM();
const { document } = dom.window;
const moment = require("moment");
const BaseCommand = require("../../Structures/BaseCommand.js");

module.exports = class Transcript extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "transcript",
      aliases: ["t"],
      description: "",
      usage: "",
    });
  }

  async run(message) {
    message.channel.send("hello");
    let messages = "";
    const channelName = message.channel.name;
    let container;

    let messageCollection = new Collection();
    let channelMessages = await message.channel.messages
      .fetch({
        limit: 100,
      })
      .catch((err) => console.log(err));

    messageCollection = messageCollection.concat(channelMessages);

    while (channelMessages.size === 100) {
      let lastMessageId = channelMessages.lastKey();
      channelMessages = await message.channel.messages
        .fetch({ limit: 100, before: lastMessageId })
        .catch((err) => console.log(err));
      if (channelMessages)
        messageCollection = messageCollection.concat(channelMessages);
    }
    let msgs = messageCollection.array().reverse();
    let data = await fs
      .readFile(__dirname + "/../../Structures/transcript.html", "utf8")
      .catch((err) => console.log(err));

    console.log(messageCollection.size);

    if (data) {
      await fs
        .writeFile(`transcript-${channelName}.html`, data)
        .catch((err) => console.log(err));

      // Info place holder
      let infoElement = document.createElement("div");
      infoElement.className = "info";

      // Guild icon
      let guildIconElement = document.createElement("div");
      guildIconElement.className = "info_guild-icon-container";
      let guildImg = document.createElement("img");
      guildImg.className = "info_guild-icon";
      guildImg.setAttribute("width", "88");
      guildImg.setAttribute(
        "src",
        message.guild.iconURL({ size: Number(128), format: "png" })
      );
      infoElement.appendChild(guildIconElement);
      guildIconElement.appendChild(guildImg);

      // Guild Info
      let guildInfoElement = document.createElement("div");
      guildInfoElement.className = "info__metadata";

      infoElement.appendChild(guildInfoElement);

      // Guild name
      let guildNameElement = document.createElement("div");
      guildNameElement.className = "info_guild-name";
      let guildName = document.createTextNode(message.guild.name);
      guildInfoElement.appendChild(guildNameElement);
      guildNameElement.appendChild(guildName);

      // Channel name
      let channelNameElement = document.createElement("div");
      channelNameElement.className = "info_channel-name";
      let chName = document.createTextNode(message.channel.name);
      guildInfoElement.appendChild(channelNameElement);
      channelNameElement.appendChild(chName);

      // Message count
      let messageCountElement = document.createElement("div");
      messageCountElement.className = "info_channel-message-count";
      let messageCount = document.createTextNode(
        `${messageCollection.size} ${
          messageCollection.size > 1 ? "messages" : "message"
        }`
      );
      guildInfoElement.appendChild(messageCountElement);
      messageCountElement.appendChild(messageCount);

      await fs
        .appendFile(`transcript-${channelName}.html`, infoElement.outerHTML)
        .catch((err) => console.log(err));

      let chatlogElement = document.createElement("div");
      chatlogElement.className = "chatlog";

      for (const msg of msgs) {
        let messageContainer = document.createElement("div");
        messageContainer.className = "chatlog_message-group";

        chatlogElement.appendChild(messageContainer);

        let chatlogAuthorElement = document.createElement("div");
        chatlogAuthorElement.className = "chatlog_author-avatar-container";

        messageContainer.appendChild(chatlogAuthorElement);

        let img = document.createElement("img");
        img.className = "chatlog_author-avatar";
        img.setAttribute(
          "src",
          msg.author.displayAvatarURL({ size: Number(128), format: "png" })
        );
        img.setAttribute("width", "44");

        chatlogAuthorElement.appendChild(img);

        // Create message container
        let chatlogMessageElement = document.createElement("div");
        chatlogMessageElement.className = "chatlog_messages";

        messageContainer.appendChild(chatlogMessageElement);

        // Create author text
        let authorElement = document.createElement("span");
        authorElement.className = "chatlog_author-name";

        let authorText = document.createTextNode(msg.author.username);
        authorElement.appendChild(authorText);
        chatlogMessageElement.appendChild(authorElement);

        // Create bot tag
        if (msg.author.bot) {
          let botTagElement = document.createElement("span");
          botTagElement.className = "chatlog_bot-tag";

          let botTag = document.createTextNode("BOT");
          botTagElement.appendChild(botTag);

          chatlogMessageElement.appendChild(botTagElement);
        }

        // Create the date
        let dateElement = document.createElement("span");
        dateElement.className = "chatlog_timestamp";

        let date = document.createTextNode(
          moment(msg.createdAt).format("MMM D[,] YYYY h:mm a")
        );

        dateElement.appendChild(date);
        chatlogMessageElement.appendChild(dateElement);

        // Add the text conatiner
        let contentContainer = document.createElement("div");
        contentContainer.className = "chatlog_content";

        chatlogMessageElement.appendChild(contentContainer);

        // Text
        let textElement = document.createElement("span");
        textElement.className = "markdown";

        let txt = document.createTextNode(msg.content);
        textElement.appendChild(txt);

        contentContainer.appendChild(textElement);

        if (msg.embeds.length > 0) {
          const embed = msg.embeds[0];

          container = document.createElement("div");
          container.className = "chatlog_embed";
          contentContainer.appendChild(container);
          let embedWrapper = document.createElement("div");
          embedWrapper.className = "chatlog_embed-wrapper";
          let grid = document.createElement("div");
          grid.className = "chatlog_embed-grid";
          let embedAuthor = document.createElement("div");
          embedAuthor.className = "chatlog_embed-author";
          let embedTitle = document.createElement("div");
          embedTitle.className = "chatlog_embed-title";
          let embedDescription = document.createElement("div");
          embedDescription.className = "chatlog_embed-description";

          // Embed color
          if (embed.color) {
            embedWrapper.style.cssText = `border-color: #${embed.color
              .toString(16)
              .padStart(6, "0")};`;
          }

          if (embed.avatar) {
            // Add avatar
            let image = document.createElement("img");
            image.setAttribute(
              "src",
              embed.author.avatarURL() ||
                "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png"
            );
            image.className = "chatlog_embed-author-icon";
            embedAuthor.appendChild(image);

            // Add author name
            let authorNode = document.createElement("a");
            let authorName = document.createTextNode(embed.avatar.username);
            authorNode.append(authorName);
            embedAuthor.appendChild(authorNode);
          }

          if (embed.title) {
            let titleNode = document.createTextNode(embed.title);
            embedTitle.append(titleNode);
          }

          if (embed.description) {
            let descriptionNode = document.createTextNode(embed.description);
            embedDescription.append(descriptionNode);
          }

          grid.appendChild(embedAuthor);
          grid.appendChild(embedTitle);
          grid.appendChild(embedDescription);
          embedWrapper.appendChild(grid);
          container.appendChild(embedWrapper);

          contentContainer.appendChild(container);
        }
      }
      await fs
        .appendFile(`transcript-${channelName}.html`, chatlogElement.outerHTML)
        .catch((err) => console.log(err));
    }

    const trans = new MessageAttachment(
      __dirname + `/../../../transcript-${channelName}.html`
    );
    message.channel.send(messages, trans).catch((err) => console.log(err));
  }
};
