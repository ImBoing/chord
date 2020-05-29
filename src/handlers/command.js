const { readdirSync } = require("fs");
const Ascii = require("ascii-table");

const table = new Ascii("Commands");
module.exports = (client) => {
  readdirSync("./src/commands").forEach((dir) => {
    const commands = readdirSync(`./src/commands/${dir}`).filter((file) =>
      file.endsWith(".js")
    );
    for (const file of commands) {
      const pull = require(`../commands/${dir}/${file}`);
      if (pull.name) {
        client.commands.set(pull.name, pull);
        table.addRow(file, "Loaded");
      } else {
        table.addRow(file);
      }
      if (pull.aliases && Array.isArray(pull.aliases))
        pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
    }
  });
  // eslint-disable-next-line no-console
  console.log(table.toString());
};
