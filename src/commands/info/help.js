const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    category: "info",
    description: "Returns all commands, or one specific command info",
    usage: "[command | alias]",
    run: async (client, message, args) => {
        if (!args[0]) {
            const hEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor('Lighting Ads Commands List', client.user.displayAvatarURL())
            .setDescription('You can use `la! help [command]` or `la! help [category]` for more help. Example: `la! help mute`')
            .addField('**Info**', `\`la!help info\``, true)
            .addField('**Moderation**', `\`la!help moderation\``, true)
            .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))

            return message.channel.send(hEmbed)
        } else {
            const categorySearch = client.commands.filter(c => c.category === args[0].toLowerCase())
            let command = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
            
                if (!command) {
                if(categorySearch.size === 0) return;
                    const category = new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(`**${args[0].slice(0, 1).toUpperCase() + args[0].slice(1)} Commands**`)
                    .setDescription(categorySearch.map(c => `\`${c.name}\``).join(' '))
                    message.channel.send(category)
                } else if (command){
                    const embed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(`**la!${command.name.slice(0, 1).toLowerCase() + command.name.slice(1)} info**`)
                    .setDescription(`${command.description}`)
                    .addField('Usage' , `\`\`\`${command.usage}\`\`\``)
                    .addField('Aliases', `\`${command.aliases ? command.aliases.join('`, `') : `No aliases`}\``)
                    message.channel.send(embed)
                }
        } 
    }
}