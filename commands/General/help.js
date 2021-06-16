const Discord = module.require(`discord.js`);
const SqlString = module.require('sqlstring');
function send(msg, embed, fn) {
    msg.channel.send(embed);
}
module.exports.run = async (client, msg, args) => {
    
    try {
        let prefix = client.config.bot.prefix;
        if (args.length > 0) {
            if (msg.member.voice.channel || msg.member.hasPermission(`MANAGE_GUILD`) || msg.member.hasPermission(`ADMINISTRATOR`)) {
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
            }
        } else {
            if (msg.member.voice.channel || msg.member.hasPermission(`MANAGE_GUILD`) || msg.member.hasPermission(`ADMINISTRATOR`)) {
                let embedcolor = client.config.embed.color;
                let giturl = client.config.bot.giturl;

                embed = new Discord.MessageEmbed()
                    .setColor(embedcolor)
                    .setTimestamp()
                    .setDescription(`This is a list of all of my commands(note some commands only appear if you're in a voice chat, or if you're the owner of a voice chat). If you want more specific information about a command like it's usage, feel free to run ${prefix}help <command_name> for more help on a command`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setAuthor(client.user.username, '', giturl)
                    .setFooter(client.config.embed.footer + ` | ` + client.config.embed.ver, client.user.avatarURL({ dynamic: true }));
            } else {
                client.functions.Reply(msg, `You are not able to run this command at this time, please try again when you're in a voice channel`)
            }
            if (!embed) return;
            let cmds = client.commands.values();
            for (var cm of cmds) {
                let name = cm.help.name;
                let description = cm.help.description;
                let usage = cm.help.usage;
                let category = cm.help.category;
                
                switch (category) {
                    case "Dev":
                        if (!client.config.staff.includes(msg.author.id)) break;
                        break;
                    case "Administrative":
                        if (!msg.member.hasPermission("MANAGE_GUILD") && !msg.member.hasPermission("ADMINISTRATOR")) break;
                        embed.addField(`${prefix}${name}`, description);
                        break;
                    case "VC Owner Command":
                        if (!msg.member.voice.channel) break;
                        embed.addField(`${prefix}${name}`, description);                        
                        break;
                    default:
                        embed.addField(`${prefix}${name}`, description);
                        break;
                }
                
            }
            send(msg, embed, client.functions)
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: `help`,
    aliases: [`h`],
    description: `This command shows information about other commands`,
    usage: `help`,
    category: `General`,
    maintenancemode: 0
}