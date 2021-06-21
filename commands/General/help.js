const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require("discord-buttons")
function send(msg, embed, fn) {
    msg.channel.send(embed);
}
exports.run = async (client, msg, args) => {

    try {
        client.functions.serverDataCheck(client, msg.guild.id, async (server) => {
            let prefix = server.prefix;
            if (args.length > 0) {
                try {
                    const cmd = args.shift().toLowerCase();
                    let command = client.commands.get(cmd);
                    let help = command.help;
                    let footer = client.config.embed.footer + client.config.embed.ver;
                    let embed = new Discord.MessageEmbed()
                        .setColor(client.config.embed.color)
                        .setFooter(footer, client.user.displayAvatarURL())
                        .setTitle(`Help for Command: ` + help.name)
                        .setTimestamp();


                    if (help.description) {
                        embed.setDescription(help.description);
                    }
                    if (help.usage) {
                        embed.addField(`Usage`, prefix + help.usage)
                    }
                    if (help.aliases) {
                        embed.addField(`Aliases`, help.aliases);
                    }
                    embed.addField(`Category`, help.category);

                    if (help.category === `Dev`) {
                        if (client.config.staff.includes(msg.author.id)) {
                            send(msg, embed, client.functions);
                            return;
                        } else {
                            client.functions.Reply(msg, `Sorry, This is a Dev Command`)
                            return;
                        }
                    }
                    if (help.category === `Administrative`) {
                        if (msg.member.hasPermission(`MANAGE_GUILD`) || msg.member.hasPermission(`ADMINISTRATOR`)) {
                            send(msg, embed, client.functions);
                            return;
                        } else {
                            client.functions.Reply(msg, client.config.messages.nomanager)
                            return;
                        }
                    }
                    send(msg, embed, client.functions);

                } catch (e) {
                    console.error(e)
                    let embed = new Discord.MessageEmbed()
                        .setColor(client.config.embed.color)
                        .setDescription(`Could not find that command`);
                    msg.channel.send(embed).then((m) => {
                        setTimeout(() => {
                            m.delete()
                        }, 5000);
                    })
                }
            } else {


                let embedcolor = client.config.embed.color;
                let giturl = client.config.bot.giturl;

                let general = new MessageButton()
                    .setLabel("General")
                    .setStyle("green")
                    .setID("GENERAL")
                let vc = new MessageButton()
                    .setLabel("VC")
                    .setStyle("blurple")
                    .setID("VC")
                let Administrative = new MessageButton()
                    .setLabel("Config")
                    .setStyle("red")
                    .setID("ADMIN")

                let Dev = new MessageButton()
                    .setLabel("Dev")
                    .setStyle("red")
                    .setID("DEV")
                let row = new MessageActionRow()
                    .addComponent(general)
                    .addComponent(vc);


                let homee = new Discord.MessageEmbed()
                    .setColor(client.config.embed.color)
                    .setAuthor("CVE Help Menu", '', giturl)
                    .setDescription(`Welcome to the Community Voice Manager Help menu. If you need more information about a specific command, you can run ${prefix}help <commandname>`)
                    .addField("General", "Opens the menu for General Commands")
                    .addField("VC", "Opens the help menu for Voice Chat commands")
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))

                    .setFooter(client.config.embed.footer + ` | ` + client.config.embed.ver, client.user.avatarURL({ dynamic: true }));

                if (msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")) {
                    row.addComponent(Administrative);
                    homee.addField("Config", "Opens the Setup Help menu");
                }
                if (client.config.staff.includes(msg.author.id)) {
                    row.addComponent(Dev);
                    homee.addField("Dev", "Shows the Dev Commands");
                }
                let generale = new Discord.MessageEmbed()
                    .setColor(client.config.embed.color)
                    .setAuthor("General Commands", '', giturl)
                    .setDescription("These commands are always available to you")
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setFooter(client.config.embed.footer + ` | ` + client.config.embed.ver, client.user.avatarURL({ dynamic: true }));

                let vce = new Discord.MessageEmbed()
                    .setColor(client.config.embed.color)
                    .setAuthor("VC Commands", '', giturl)
                    .setDescription("These are all the commands that you can use while you're in the voice chats")
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setFooter(client.config.embed.footer + ` | ` + client.config.embed.ver, client.user.avatarURL({ dynamic: true }));

                let Administrativee = new Discord.MessageEmbed()
                    .setColor(client.config.embed.color)
                    .setAuthor("Setup Commands", '', giturl)
                    .setDescription("These are all of the administrative commands")
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setFooter(client.config.embed.footer + ` | ` + client.config.embed.ver, client.user.avatarURL({ dynamic: true }));

                let Deve = new Discord.MessageEmbed()
                    .setColor(client.config.embed.color)
                    .setAuthor("Dev Commands", '', giturl)
                    .setDescription("These are Dev Commands :3")
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setFooter(client.config.embed.footer + ` | ` + client.config.embed.ver, client.user.avatarURL({ dynamic: true }));

                let cmds = client.commands.values();
                for (var cm of cmds) {
                    let name = cm.help.name;
                    let description = cm.help.description;
                    let usage = cm.help.usage;
                    let category = cm.help.category;
                    let Maitenance = cm.help.maintenancemode;
                    if (Maitenance === 0) {
                        switch (category) {
                            case "Dev":
                                Deve.addField(`${prefix}${usage}`, `${description}`);
                                break;
                            case "Administrative":
                                Administrativee.addField(`${prefix}${usage}`, `${description}`);
                                break;
                            case "VC Owner Command":
                                vce.addField(`${prefix}${usage}`, `${description}`);
                                break;
                            default:
                                generale.addField(`${prefix}${usage}`, `${description}`);
                                break;
                        }
                    }

                }
                let m = await msg.channel.send('', {
                    embed: homee,
                    component: row
                });


                const filter = (button) => button.clicker.user.id === msg.author.id;
                const collector = m.createButtonCollector(filter, {
                    time: 120000 // collector lasts 2 minutes
                });

                collector.on('collect', async (b) => {
                    if (b.clicker.member.id != msg.author.id) {
                        await b.defer(true);
                    };
                    switch (b.id) {
                        case "GENERAL":
                            m.edit('', {
                                embed: generale
                            });
                            break;
                        case "VC":
                            m.edit('', {
                                embed: vce
                            });
                            break;
                        case "ADMIN":
                            m.edit('', {
                                embed: Administrativee
                            });
                            break;
                        case "DEV":
                            m.edit('', {
                                embed: Deve
                            });
                            break;
                    }
                    await b.defer(true);
                });
                collector.on('end', collected => {
                    let embed = new Discord.MessageEmbed()
                        .setColor(client.config.embed.color)
                        .setDescription("No more interactions will be accepted")
                    msg.channel.send('', {
                        embed: embed
                    });
                });
            }
        })
    } catch (e) {
        console.error(e);
        client.functions.Reply(msg, "There was an error with this command, contact bot support")
    }
};
module.exports.help = {
    name: `help`,
    aliases: [`h`],
    description: `This command shows information about other commands`,
    usage: `help`,
    category: `General`,
    maintenancemode: 0
}