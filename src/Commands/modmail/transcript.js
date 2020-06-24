const { Collection, MessageAttachment } = require('discord.js');
const fs = require('fs').promises;
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const dom = new JSDOM();
const { document } = dom.window;
const moment = require('moment');
const BaseCommand = require('../../Structures/BaseCommand.js');

module.exports = class Transcript extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'transcript',
      aliases: ['t'],
      description: '',
      usage: '',
    });
  }

  async run(message) {
    message.channel.send('hello');
    const messages = '';
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
      const lastMessageId = channelMessages.lastKey();
      channelMessages = await message.channel.messages
        .fetch({ limit: 100, before: lastMessageId })
        .catch((err) => console.log(err));
      if (channelMessages)
        messageCollection = messageCollection.concat(channelMessages);
    }
    const msgs = messageCollection.array().reverse();
    const data = await fs
      .readFile(`${__dirname}/../../Structures/transcript.html`, 'utf8')
      .catch((err) => console.log(err));

    console.log(messageCollection.size);

    if (data) {
      await fs
        .writeFile(`transcript-${channelName}.html`, data)
        .catch((err) => console.log(err));

      // Info place holder
      const infoElement = document.createElement('div');
      infoElement.className = 'info';

      // Guild icon
      const guildIconElement = document.createElement('div');
      guildIconElement.className = 'info_guild-icon-container';
      const guildImg = document.createElement('img');
      guildImg.className = 'info_guild-icon';
      guildImg.setAttribute('width', '88');
      guildImg.setAttribute(
        'src',
        message.guild.iconURL({ size: Number(128), format: 'png' }),
      );
      infoElement.appendChild(guildIconElement);
      guildIconElement.appendChild(guildImg);

      // Guild Info
      const guildInfoElement = document.createElement('div');
      guildInfoElement.className = 'info__metadata';

      infoElement.appendChild(guildInfoElement);

      // Guild name
      const guildNameElement = document.createElement('div');
      guildNameElement.className = 'info_guild-name';
      const guildName = document.createTextNode(message.guild.name);
      guildInfoElement.appendChild(guildNameElement);
      guildNameElement.appendChild(guildName);

      // Channel name
      const channelNameElement = document.createElement('div');
      channelNameElement.className = 'info_channel-name';
      const chName = document.createTextNode(message.channel.name);
      guildInfoElement.appendChild(channelNameElement);
      channelNameElement.appendChild(chName);

      // Message count
      const messageCountElement = document.createElement('div');
      messageCountElement.className = 'info_channel-message-count';
      const messageCount = document.createTextNode(
        `${messageCollection.size} ${
          messageCollection.size > 1 ? 'messages' : 'message'
        }`,
      );
      guildInfoElement.appendChild(messageCountElement);
      messageCountElement.appendChild(messageCount);

      await fs
        .appendFile(`transcript-${channelName}.html`, infoElement.outerHTML)
        .catch((err) => console.log(err));

      const chatlogElement = document.createElement('div');
      chatlogElement.className = 'chatlog';

      for (const msg of msgs) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'chatlog_message-group';

        chatlogElement.appendChild(messageContainer);

        const chatlogAuthorElement = document.createElement('div');
        chatlogAuthorElement.className = 'chatlog_author-avatar-container';

        messageContainer.appendChild(chatlogAuthorElement);

        const img = document.createElement('img');
        img.className = 'chatlog_author-avatar';
        img.setAttribute(
          'src',
          msg.author.displayAvatarURL({ size: Number(128), format: 'png' }),
        );
        img.setAttribute('width', '44');

        chatlogAuthorElement.appendChild(img);

        // Create message container
        const chatlogMessageElement = document.createElement('div');
        chatlogMessageElement.className = 'chatlog_messages';

        messageContainer.appendChild(chatlogMessageElement);

        // Create author text
        const authorElement = document.createElement('span');
        authorElement.className = 'chatlog_author-name';

        const authorText = document.createTextNode(msg.author.username);
        authorElement.appendChild(authorText);
        chatlogMessageElement.appendChild(authorElement);

        // Create bot tag
        if (msg.author.bot) {
          const botTagElement = document.createElement('span');
          botTagElement.className = 'chatlog_bot-tag';

          const botTag = document.createTextNode('BOT');
          botTagElement.appendChild(botTag);

          chatlogMessageElement.appendChild(botTagElement);
        }

        // Create the date
        const dateElement = document.createElement('span');
        dateElement.className = 'chatlog_timestamp';

        const date = document.createTextNode(
          moment(msg.createdAt).format('MMM D[,] YYYY h:mm a'),
        );

        dateElement.appendChild(date);
        chatlogMessageElement.appendChild(dateElement);

        // Add the text conatiner
        const contentContainer = document.createElement('div');
        contentContainer.className = 'chatlog_content';

        chatlogMessageElement.appendChild(contentContainer);

        // Text
        const textElement = document.createElement('span');
        textElement.className = 'markdown';

        const txt = document.createTextNode(msg.content);
        textElement.appendChild(txt);

        contentContainer.appendChild(textElement);

        if (msg.embeds.length > 0) {
          const embed = msg.embeds[0];

          container = document.createElement('div');
          container.className = 'chatlog_embed';
          contentContainer.appendChild(container);
          const embedWrapper = document.createElement('div');
          embedWrapper.className = 'chatlog_embed-wrapper';
          const grid = document.createElement('div');
          grid.className = 'chatlog_embed-grid';
          const embedAuthor = document.createElement('div');
          embedAuthor.className = 'chatlog_embed-author';
          const embedTitle = document.createElement('div');
          embedTitle.className = 'chatlog_embed-title';
          const embedDescription = document.createElement('div');
          embedDescription.className = 'chatlog_embed-description';

          // Embed color
          if (embed.color) {
            embedWrapper.style.cssText = `border-color: #${embed.color
              .toString(16)
              .padStart(6, '0')};`;
          }

          if (embed.avatar) {
            // Add avatar
            const image = document.createElement('img');
            image.setAttribute(
              'src',
              embed.author.avatarURL() ||
                'https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png',
            );
            image.className = 'chatlog_embed-author-icon';
            embedAuthor.appendChild(image);

            // Add author name
            const authorNode = document.createElement('a');
            const authorName = document.createTextNode(embed.avatar.username);
            authorNode.append(authorName);
            embedAuthor.appendChild(authorNode);
          }

          if (embed.title) {
            const titleNode = document.createTextNode(embed.title);
            embedTitle.append(titleNode);
          }

          if (embed.description) {
            const descriptionNode = document.createTextNode(embed.description);
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
      `${__dirname}/../../../transcript-${channelName}.html`,
    );
    message.channel.send(messages, trans).catch((err) => console.log(err));
  }
};
