const Discord = module.require("discord.js");
function send(msg, embed, fn) {
    msg.channel.send(embed).then((m) => {
        setTimeout(() => {
            m.delete();
            fn.Reply(msg, "Menu go YEET ")
        }, 45000);
    });
}
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        let prefix = config.bot.prefix;
        if (args.length > 0) {
            if (msg.member.voice.channel || msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")) {
                try {
                    const cmd = args.shift().toLowerCase();
                    let command = client.commands.get(cmd);
                    let help = command.help;
                    let footer = config.embed.footer + config.embed.ver;
                    let embed = new Discord.MessageEmbed()
                        .setColor(config.embed.color)
                        .setFooter(footer, client.user.displayAvatarURL())
                        .setTitle("Help for Command: " + help.name)
                        .setTimestamp();


                    if (help.description) {
                        embed.setDescription(help.description);
                    }
                    if (help.usage) {
                        embed.addField("Usage", prefix + help.usage)
                    }
                    if (help.aliases) {
                        embed.addField("Aliases", help.aliases);
                    }
                    embed.addField("Category", help.category);

                    if (help.category === "Dev") {
                        if (config.staff.includes(msg.author.id)) {
                            send(msg, embed, fn);
                            return;
                        } else {
                            fn.Reply(msg, "Sorry, This is a Dev Command")
                            return;
                        }
                    }
                    if (help.category === "Administrative") {
                        if (msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")) {
                            send(msg, embed, fn);
                            return;
                        } else {
                            fn.Reply(msg, config.messages.nomanager)
                            return;
                        }
                    }
                    send(msg, embed, fn);

                } catch {
                    let embed = new Discord.MessageEmbed()
                        .setColor(config.embed.color)
                        .setDescription("Could not find that command");
                    msg.channel.send(embed).then((m) => {
                        setTimeout(() => {
                            m.delete();
                        }, 5000);
                    })
                }
            }
        } else {
            if (msg.member.voice.channel || msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")) {
                let embedcolor = config.embed.color;
                let giturl = config.bot.giturl;

                embed = new Discord.MessageEmbed()
                    .setColor(embedcolor)
                    .setTimestamp()
                    .setDescription("This is a list of all of my commands(note some commands only appear if you're in a voice chat, or if you're the owner of a voice chat). If you want more specific information about a command like it's usage, feel free to run " + prefix + "help <command_name> for more help on a command")
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setAuthor(client.user.username, '', giturl)
                    .setFooter(config.embed.footer + " | " + config.embed.ver, client.user.avatarURL({ dynamic: true }));
            }

            if (msg.member.voice.channel) {
                embed.addField(prefix + "github", "Shows this bot's GitHub Url")
                embed.addField(prefix + "owner", "Shows who the current owner of the channel is")
                embed.addField(prefix + "claim", "Claim the voice chat if the owner has left");
                if (fn.vcOwnerCheck(msg.member.voice.channel.id, msg.author.id, msg)) {
                    embed.addField(prefix + "kick @member", "Kicks a @mentioned member from the voice channel")
                    embed.addField(prefix + "rename", "allows the channel owner to rename the voice chat")
                    embed.addField(prefix + "lock", "Locks the channel and makes it visible and joinable by those who are invited.")
                    embed.addField(prefix + "unlock", "unlocks a voice chat and allows it to be seen and joined by anyone")
                    embed.addField(prefix + "invite @member", "allows a mentioned member to see and join the channel")
                }
            }
            if (msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")) {
                embed.addField(prefix + "newcat", "Generates a new category and a join channel for that category");
                embed.addField(prefix + "template", "Updates the category's template.");
                embed.addField(prefix + "increment", "Overrides the category's increment");
                embed.addField(prefix + "lockable <category_id> enable|disable", "Enables/Disables the ability to lock a channel within a category");
                embed.addField(prefix + "debug", "Debugs the bot's perms for the server or a channel");
            }
            if (msg.member.voice.channel || msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")) {
                msg.channel.send(embed).then((m) => {
                    setTimeout(() => {
                        m.delete();
                        fn.Reply(msg, "Menu go YEET ")
                    }, 45000);
                });
            } else {
                fn.Reply(msg, "You are not able to run this command at this time, please try again when you're in a voice channel")
            }
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "help",
    aliases: ["h"],
    description: "This command shows information about other commands",
    usage: "help",
    category: "General"
}