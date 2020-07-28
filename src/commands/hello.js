const GenericCommand = require('../structures/GenericCommand.js');

module.exports = class Help extends GenericCommand {
  constructor(...args) {
    super(...args, {
      name: 'hello',
      aliases: ['test'],
      description: 'Test commands',
      usage: 'hello',
      category: 'general',
    });
  }

  async run(message) {
    message.channel.send('The command handler is working.');
  }
};
