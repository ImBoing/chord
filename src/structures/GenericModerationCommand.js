const GenericCommand = require('./GenericCommand.js');

module.exports = class GenericModerationCommand extends GenericCommand {
  // eslint-disable-next-line no-unused-vars
  async run(message, args) {
    throw new Error(`Command ${this.name} does not have a run method`);
  }
};
