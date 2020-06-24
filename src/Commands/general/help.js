/* eslint-disable class-methods-use-this */
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../Structures/BaseCommand.js");

module.exports = class Help extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "help",
      aliases: ["help", "helpme", "commands"],
      description: "Help commands",
      usage: "help",
      category: "general",
    });
  }

  async run(message, args) {
    if (!args[0]) {
      const hEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(
          "Lighting Ads Commands List",
          this.client.user.displayAvatarURL()
        )
        .setDescription(
          "You can use `la!help [command]` or `la! help [category]` for more help. Example: `la!help mute`"
        )
        .addField("**Info**", `\`la!help info\``, true)
        .addField("**Moderation**", `\`la!help moderation\``, true)
        .setThumbnail(this.client.user.displayAvatarURL({ size: 1024 }));

      message.channel.send(hEmbed);
    } else {
      const categorySearch = this.client.commands.filter(
        (c) => c.category === args[0].toLowerCase()
      );
      const command =
        this.client.commands.get(args[0].toLowerCase()) ||
        this.client.commands.get(
          this.client.aliases.get(args[0].toLowerCase())
        );
      if (!command) {
        if (categorySearch.size === 0) return;
        const category = new MessageEmbed()
          .setColor("RANDOM")
          .setTitle(
            `**${
              args[0].slice(0, 1).toUpperCase() + args[0].slice(1)
            } Commands**`
          )
          .setDescription(categorySearch.map((c) => `\`${c.name}\``).join(" "));
        message.channel.send(category);
      } else if (command) {
        const embed = new MessageEmbed()
          .setColor("RANDOM")
          .setTitle(
            `**la!${
              command.name.slice(0, 1).toLowerCase() + command.name.slice(1)
            } info**`
          )
          .setDescription(`${command.description}`)
          .addField("Usage", `\`\`\`${command.usage}\`\`\``)
          .addField(
            "Aliases",
            `\`${
              command.aliases ? command.aliases.join("`, `") : `No aliases`
            }\``
          );
        message.channel.send(embed);
      }
    }
  }
};
