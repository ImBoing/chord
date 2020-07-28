const { MessageEmbed } = require('discord.js');
const GenericCommand = require('../../structures/GenericCommand.js');

module.exports = class Help extends GenericCommand {
  constructor(...args) {
    super(...args, {
      name: 'embed',
      aliases: ['say', 'announce'],
      description: 'embed commands',
      usage: '{prefix}embed {prefix}say',
      category: 'tools',
    });
  }

  async run(message) {
    let channel;
    let content;
    let description;
    let color;

    const filter = (m) => m.author.id === message.author.id;
    await message.delete();

    const cancelEmbed = new MessageEmbed()
      .setColor('PURPLE')
      .setDescription('Alright, the process has been cancelled.');

    const timeoutEmbed = new MessageEmbed()
      .setColor('PURPLE')
      .setDescription('You took to long to answer. Process cancelled.');

    const initEmbed = new MessageEmbed()
      .setColor('PURPLE')
      .setTitle('Embed Setup • 1/4')
      .setDescription(
        'Please mention or type the id of the channel you want to send the embed to.\n\n**Note:** You can type __cancel__ at any moment to cancel the embed creation.',
      );

    await message.channel.send(initEmbed).then(async (msg) => {
      const channelCollect = msg.channel.createMessageCollector(filter, {
        time: 10000,
      });
      channelCollect.on('collect', async (m) => {
        await m.delete();
        channel =
          m.mentions.channels.first() ||
          this.client.channels.cache.get(m.content);

        if (m.content.toLowerCase() === 'cancel') {
          return channelCollect.stop('cancel');
        }

        if (!channel) {
          const noChan = new MessageEmbed()
            .setColor('PURPLE')
            .setDescription(
              `**Error:** I couldn't find any channel with the id • \`${m.content}\`\n\nTry again by typing the channel if or mention it!`,
            );

          message.channel.send(noChan).then(async (k) => {
            await k.delete({ timeout: 2400 });
          });
        } else {
          channelCollect.stop();
          const initEmbed2 = new MessageEmbed()
            .setColor('PURPLE')
            .setTitle('Embed Setup • 2/4')
            .setDescription(
              'Please enter the embed title under this message.\n\n>>> Use `none` if you do not want a title.',
            );
          msg.edit(initEmbed2).then(async (w) => {
            const titleCollect = w.channel.createMessageCollector(filter, {
              time: 34000,
            });

            titleCollect.on('collect', async (j) => {
              await j.delete();

              if (j.content.toLowerCase() === 'cancel') {
                return titleCollect.stop('cancel');
              } else if (j.content.length > 246) {
                const max = new MessageEmbed()
                  .setColor('PURPLE')
                  .setDescription(
                    `**Error:** Your embed title is too long.\n\n\`The max length of an embed title is 246 characters.\``,
                  );

                j.channel.send(max);
              } else {
                content = j.content;
                titleCollect.stop();
                const descriptionEmbed = new MessageEmbed()
                  .setColor('PURPLE')
                  .setTitle('Embed Setup • 3/4')
                  .setDescription(
                    'Please enter the embed description under this message.\n\n>>> Use `none` if you do not want a description',
                  );
                msg.edit(descriptionEmbed).then(async (p) => {
                  const descriptionCollect = p.channel.createMessageCollector(
                    filter,
                    { time: 6000 * 2 },
                  );

                  descriptionCollect.on('collect', async (k) => {
                    await k.delete();

                    if (k.content.toLowerCase() === 'cancel') {
                      descriptionCollect.stop('cancel');
                    } else if (k.content.length > 2048) {
                      const maxDesc = new MessageEmbed()
                        .setColor('PURPLE')
                        .setDescription(
                          `**Error:** Your embed description is too long.\n\n\`The max length of an embed description is 2048 characters.\``,
                        );

                      k.channel.send(maxDesc).then(async (u) => {
                        await u.delete({ timeout: 2400 });
                      });
                    } else {
                      description = k.content;
                      descriptionCollect.stop();

                      const colorEmbed = new MessageEmbed()
                        .setColor('PURPLE')
                        .setTitle('Embed Setup • 4/4')
                        .setDescription(
                          'Please enter the a embed color under this message.\n\nUse `none` if you do not want a color.\n\nA valid hex color starts with `#`. The default color is purple.',
                        );
                      msg.edit(colorEmbed).then(async (q) => {
                        const colorCollect = q.channel.createMessageCollector(
                          filter,
                          { time: 24000 },
                        );

                        colorCollect.on('collect', async (g) => {
                          await g.delete();

                          const hexCode = /^#[0-9A-F]{6}$/i.test(g.content);

                          if (g.content.toLowerCase() === 'cancel') {
                            colorCollect.stop('cancel');
                          }
                          if (!hexCode && g.content !== 'none') {
                            const invalidCode = new MessageEmbed()
                              .setColor('PURPLE')
                              .setDescription(
                                `**Error:** You have provided an invalid hex code.\n\n\`Hex codes are usually 6 characters and start with a #.\``,
                              );

                            g.channel.send(invalidCode).then(async (b) => {
                              await b.delete({ timeout: 2400 });
                            });
                          } else {
                            color = g.content;
                            console.log(color);
                            colorCollect.stop();

                            const end = new MessageEmbed()
                              .setColor('PURPLE')
                              .setTitle('Embed Sent!')
                              .setDescription(
                                `The embed has been created in <#${channel.id}>.`,
                              );

                            msg.edit(end);

                            const embed = new MessageEmbed();

                            if (content !== 'none') {
                              console.log('set a title');

                              embed.setTitle(content);
                            } else if (description !== 'none') {
                              embed.setDescription(description);
                            }

                            if (color === 'none') {
                              embed.setColor('PURPLE');
                              console.log('no color');
                            } else {
                              embed.setColor(`${color}`);
                            }

                            embed.setFooter(`${message.author.tag}`);
                            embed.setTimestamp();

                            channel.send(embed);
                          }
                        });

                        channelCollect.on('end', async (_, reason) => {
                          if (['cancel'].includes(reason))
                            return msg.edit(cancelEmbed);
                          if (['time'].includes(reason))
                            return msg.edit(timeoutEmbed);
                        });
                      });
                    }
                  });

                  descriptionCollect.on('end', async (_, reason) => {
                    if (['cancel'].includes(reason))
                      return msg.edit(cancelEmbed);
                    if (['time'].includes(reason))
                      return msg.edit(timeoutEmbed);
                  });
                });
              }
            });

            titleCollect.on('end', async (_, reason) => {
              if (['cancel'].includes(reason)) return msg.edit(cancelEmbed);
              if (['time'].includes(reason)) return msg.edit(timeoutEmbed);
            });
          });
        }
      });

      channelCollect.on('end', async (_, reason) => {
        if (['cancel'].includes(reason)) return msg.edit(cancelEmbed);
        if (['time'].includes(reason)) return msg.edit(timeoutEmbed);
      });
    });
  }
};
