module.exports = class Command {
  constructor(client, name, options = {}) {
    this.client = client;
    this.name = options.name || name;
    this.aliases = options.aliases || [];
    this.description = options.description || "No description";
    this.category = options.category || "No category";
    this.usage = options.usage || "No usage";
  }

  // eslint-disable-next-line no-unused-vars
  async run(message, args) {
    throw new Error(`Command ${this.name} does not have a run method`);
  }
};
