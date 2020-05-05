const Discord = require("discord.js");
module.exports = {
    name: "say",

    run: async (client, message, args) => {
        await message.delete();
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You do not have permission to use this :x:");
        let botmessage = args.join(" ");
        message.delete().catch();
        message.channel.send(botmessage);
    }

}
