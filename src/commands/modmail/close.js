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
            const array = message.channel.topic
            const id = array.split(' ')[2]
            const user = client.users.cache.get(id)

            const close = new MessageEmbed()
            .setColor('RED')
            .setTitle('Thread Closed')
            .setDescription(`<@${message.author.id}> has closed this Modmail thread`)
            .setFooter('Replying will open another thread')
            .setTimestamp()

            user.send(close)

            const channel = message.channel
            channel.delete()

        }
    }

}