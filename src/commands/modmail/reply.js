const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "close",
    category: "modmail",
    usage: 'close',
    run: async (client, message, args) => {
        const modcat = ['714882756131160074', '714883352510857357', '714882834103533599', '714882905645514782']
        if (!modcat.includes(message.channel.parentID)) {
            return;
        } else {
            await message.delete()
            
            const array = message.channel.topic
            const id = array.split(' ')[2]
            const user = client.users.cache.get(id)

            const content = args.slice(0).join(' ')

            const reply = new MessageEmbed()
            .setColor('RED')
            .setAuthor(message.author.tag, message.author.displayAvatarURL(), `https://discordapp.com/users/${message.author.id}`)
            .setDescription(content)
            .setFooter('Message recieved')
            .setTimestamp()

            user.send(reply)
        }
    }

}