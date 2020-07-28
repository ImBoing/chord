const GenericCommand = require('../../structures/GenericCommand.js');

module.exports = class Help extends GenericCommand {
  constructor(...args) {
    super(...args, {
      name: 'ping',
      aliases: ['latency', 'lifeline'],
      description: 'Used to check if the bot is alive',
      usage: '{prefix}ping',
      category: 'general',
    });
  }

  async run(message) {
    const m = await message.channel.send('Ping!');

    await m.edit(
      `Pong!\n**Latency:** ${
        m.createdTimestamp - message.createdTimestamp
      }ms\n**API Latency:**${this.client.ws.ping}ms\n**Node:** ${
        process.version
      }`,
    );
  }
};
