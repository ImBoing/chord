// const { MessageEmbed } = require('discord.js');
// const BaseCommand = require('../../structures/BaseCommand.js');
// const Data = require('../../database/models/snippet.js');

// module.exports = class Hello extends BaseCommand {
//   constructor(...args) {
//     super(...args, {
//       name: 'testsnippet',
//       aliases: [],
//       description: 'add, view, test, or remove snippets',
//       usage: '',
//     });
//   }

//   async run(message, args) {
//     const condition = args[0];
//     if (condition === 'add') {
//       // Used to add snippet
//       let name;
//       let snippet;
//       console.log('add a snippet');
//       if (args[1].charAt(0) === '"') {
//         console.log('long name');
//         // All the information to format snippet (IMPORTANT)
//         const org = args.slice(1).join(' ');
//         const dos = org.match(/".*"/g).join(' ');
//         const tres = dos.replace('"', '');
//         const quatro = tres.replace('"', '');
//         const pepe = quatro.trim();
//         const cinco = org.replace('"', '');
//         const sies = cinco.replace('"', '');

//         // Snippet information name and content
//         snippet = sies.slice(pepe.length).trim();
//         name = quatro;

//         // Handaling the db
//         let snip = await Data.findOne({
//           snippetName: name,
//         });
//         if (!snip) {
//           // If there is no data with the same name
//           snip = new Data({
//             snippetName: name,
//             snippetContent: snippet,
//             guild: message.guild.id,
//           });
//           // Save the snippet
//           await snip.save().catch((err) => console.log(err));
//           message.channel.send('Saved the snippet');
//         } else {
//           // Update the snippet
//           snip.snippetName = name;
//           snip.snippetContent = snippet;
//           await snip.save().catch((err) => console.log(err));
//           message.channel.send(`${name} has been successfully updated`);
//         }
//       } else {
//         // eslint-disable-next-line prefer-destructuring
//         name = args[1];
//         snippet = args.slice(2).join(' ');
//         console.log(name);
//         await Data.findOne({
//           snippetName: name,
//         }).then(async (res) => {
//           console.log(res);

//           if (!res) {
//             console.log('Not in db');
//             // If there is no data with the same name
//             res = new Data({
//               snippetName: name,
//               snippetContent: snippet,
//               guild: message.guild.id,
//             });
//             await res.save().catch((err) => console.log(err));
//             message.channel.send(`${name} has been saved`);
//           } else {
//             console.log('in db');
//             res.snippetName = name;
//             res.snippetContent = snippet;
//             await res.save().catch((err) => console.log(err));
//             message.channel.send(`${name} has been successfully updated`);
//           }
//         });
//       }
//     } else if (condition === 'remove') {
//       console.log('remove a snippet');
//       const rem = await Data.findOne({
//         guild: message.guild.id,
//         snippetName: args.slice(1).join(' '),
//       });
//       if (!rem) {
//         message.channel.send('There seems to be no snippet with that name');
//       } else {
//         rem.deleteOne().catch((err) => console.log(err));
//         message.channel.send('The snippet has successfully been removed');
//       }
//     } else if (condition === 'test') {
//       console.log('test a snippet');
//       await Data.findOne({
//         snippetName: args.slice(1).join(' '),
//       }).then((res) => {
//         message.channel.send(res.snippetContent);
//       });
//     } else if (condition === 'view') {
//       console.log('view all');
//       let sOut;
//       Data.find({
//         guild: message.guild.id,
//       }).then((res) => {
//         if (res.length === 0) {
//           sOut = 'No snippets have been setup yet';
//         } else {
//           const sName = res.map((z) => z.snippetName);
//           const sContent = res.map((x) => x.snippetContent);
//           const sOutput = sContent.map((a, b) => {
//             return [`Name: **${sName[b]}**\nSnippet: ${a}`];
//           });
//           sOut = sOutput.join('\n\n');
//         }
//         const view = new MessageEmbed()
//           .setColor('RANDOM')
//           .setTitle('ModMail Snippets')
//           .setDescription(sOut);

//         message.channel.send(view);
//       });
//     } else {
//       const modCat = [
//         '714882756131160074',
//         '714883352510857357',
//         '714882834103533599',
//         '714882905645514782',
//       ];
//       if (modCat.includes(message.channel.parentID)) {
//         try {
//           await Data.findOne({
//             snippetName: args.slice(0).join(' '),
//           }).then(async (res) => {
//             const array = message.channel.topic;
//             const id = array.split(' ')[2];
//             const user = this.client.users.cache.get(id);

//             const embed = new MessageEmbed()
//               .setColor('GREEN')
//               .setAuthor(
//                 message.author.tag,
//                 message.author.displayAvatarURL(),
//                 `https://discordapp.com/users/${message.author.id}`,
//               )
//               .setDescription(res.snippetContent)
//               .setFooter('Message received')
//               .setTimestamp();

//             user.send(embed);
//             message.channel
//               .send('I have successfully sent the message to the user')
//               .then((msg) => {
//                 msg.delete({ timeout: 5000 });
//               });
//           });
//         } catch (err) {
//           /* EMPTY */
//         }
//       }
//     }
//   }
// };
