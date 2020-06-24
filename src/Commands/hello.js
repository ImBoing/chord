/* eslint-disable class-methods-use-this */
const BaseCommand = require("../Structures/BaseCommand.js");

module.exports = class Hello extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "hello",
      aliases: ["hello", "test"],
      description: "a test command",
      usage: "hello",
    });
  }

  async run(message) {
    message.channel.send("The command handler is working!");
  }
};
/* eslint-disable class-methods-use-this */
