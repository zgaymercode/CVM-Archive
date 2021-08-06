const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require("discord-buttons")
function send(msg, embed, fn) {
    msg.channel.send(embed);
}
exports.run = async (client, msg, args) => {

    try {
        client.functions.serverDataCheck(client, msg.guild.id, async (server) => {
            client.functions.premiumChannelPermChecks(client, msg, async (premiumPerms) => {
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
                        switch (help.category) {
                            case 'Dev':
                                if (client.config.staff.includes(msg.author.id)) {
                                    send(msg, embed, client.functions);
                                    return;
                                } else {
                                    client.functions.Reply(msg, `Sorry, This is a Dev Command`)
                                    return;
                                }
                                break;
                            case 'Administrative':
                                if (msg.member.hasPermission(`MANAGE_GUILD`) || msg.member.hasPermission(`ADMINISTRATOR`)) {
                                    send(msg, embed, client.functions);
                                    return;
                                } else {
                                    client.functions.Reply(msg, client.config.messages.nomanager)
                                    return;
                                }
                                break;
                            case 'VC Owner Command':
                                switch (help.name) {
                                    case 'kick':
                                        if (server.kick === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    case 'transfer':
                                        if (server.transfer === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    case 'coowner':
                                        if (server.coowner === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    case 'invite':
                                        if (server.invite === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    case 'limit':
                                        if (server.limit === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    case 'partyadd':
                                        if (server.partyadd === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    case 'partyclear':
                                        if (server.partyclear === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    case 'partyremove':
                                        if (server.partyremove === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    case 'lock':
                                        if (server.lock === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    case 'unlock':
                                        if (server.unlock === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    case 'rename':
                                        if (server.rename === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    case 'queue':
                                        if (server.queue === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);;
                                        send(msg, embed, client.functions);
                                        break;
                                    default:
                                        send(msg, embed, client.functions);
                                        break;
                                }
                                break;
                            default:
                                switch (help.name) {
                                    case 'owner':
                                        if (server.owner === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    case 'claim':
                                        if (server.claim === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    case 'hand':
                                        if (server.hand === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                        send(msg, embed, client.functions);
                                        break;
                                    default:
                                        send(msg, embed, client.functions);
                                        break;
                                }
                        }


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
                        .setLabel("General / VC")
                        .setStyle("green")
                        .setID("GENERAL")
                    let vc = new MessageButton()
                        .setLabel("VC Owner Cmds")
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
                        .addComponent(vc)
                    //.addComponent(activity);


                    let homee = new Discord.MessageEmbed()
                        .setColor(client.config.embed.color)
                        .setAuthor("CVE Help Menu", '', giturl)
                        .setDescription(`Welcome to the Community Voice Manager Help menu.\nIf you need more information about a specific command, you can run ${prefix}help <commandname>\n [Invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=288369680&scope=bot%20applications.commands)`)
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
                        .setAuthor("VC Owner Commands", '', giturl)
                        .setDescription("These are all the commands that you can use while you're the owner of voice chats")
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
                                    switch (name) {
                                        case 'kick':
                                            if (server.kick === 0) break;
                                            if (premiumPerms.kick === 0) break;
                                            vce.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        case 'transfer':
                                            if (server.transfer === 0) break;
                                            if (premiumPerms.transfer === 0) break;
                                            vce.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        case 'coowner':
                                            if (server.coowner === 0) break;
                                            if (premiumPerms.coowner === 0) break;
                                            vce.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        case 'invite':
                                            if (server.invite === 0) break;
                                            if (premiumPerms.invite === 0) break;
                                            vce.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        case 'limit':
                                            if (server.limit === 0) break;
                                            if (premiumPerms.limit === 0) break;
                                            vce.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        case 'partyadd':
                                            if (server.partyadd === 0) break;
                                            if (premiumPerms.partyadd === 0) break;
                                            vce.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        case 'partyclear':
                                            if (server.partyclear === 0) break;
                                            if (premiumPerms.partyclear === 0) break;
                                            vce.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        case 'partyremove':
                                            if (server.partyremove === 0) break;
                                            if (premiumPerms.partyremove === 0) break;
                                            vce.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        case 'lock':
                                            if (server.lock === 0) break;
                                            if (premiumPerms.lock === 0) break;
                                            vce.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        case 'unlock':
                                            if (server.unlock === 0) break;
                                            if (premiumPerms.unlock === 0) break;
                                            vce.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        case 'rename':
                                            if (server.rename === 0) break;
                                            if (premiumPerms.rename === 0) break;
                                            vce.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        case 'queue':
                                            if (server.queue === 0) break;
                                            if (premiumPerms.queue === 0) break;
                                            generale.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        default:
                                            vce.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                    }

                                    break;
                                default:
                                    switch (name) {
                                        case 'owner':
                                            if (server.owner === 0) break;
                                            generale.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        case 'claim':
                                            if (server.claim === 0) break;
                                            generale.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        case 'hand':
                                            if (server.hand === 0) break;
                                            generale.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                        default:
                                            generale.addField(`${prefix}${usage}`, `${description}`);
                                            break;
                                    }
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
    cooldown: 0,
    maintenancemode: 0
}