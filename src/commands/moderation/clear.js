const Discord = require("discord.js");
module.exports = {
    name: "clear",
    category: "moderation",
    run: async (client, message, args) => {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Im sorry, You cant do that :x:");
        message.delete();
        if (!args[0]) return message.channel.send("Please enter a amount to clear");
        message.channel.bulkDelete(args[0]).then(() => {
            message.channel.send(`Removed ${args[0]} messages!`).then(msg => msg.delete(5000));
        });
    }
}