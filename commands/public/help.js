const Discord = module.require("discord.js");
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        let prefix = config.bot.prefix;
        if (args.length > 0) {
            try {
                const cmd = args.shift().toLowerCase();
                let command = client.commands.get(cmd);
                let help = command.help;
                let footer = config.embed.footer + config.embed.ver;
                let embed = new Discord.MessageEmbed()
                    .setColor(config.embed.color)
                    .setFooter(footer, client.user.displayAvatarURL())
                    .setTitle("Help for Command: " + help.name)
                    
                
                if (help.description) {
                    embed.setDescription(help.description);
                }
                if (help.usage) {
                    embed.addField("Usage", prefix + help.usage)
                }
                if (help.aliases) {
                    embed.addField("Aliases", help.aliases);
                }
                if(help.category){
                    embed.addField("Category", help.category);
                }

                msg.channel.send(embed);

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
        } else {


            
            let embedcolor = config.embed.color;

            let embed = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setTimestamp()
                .setDescription("This is a list of all of my commands. If you want more specific information about a command like it's usage, feel free to run " + prefix + "help <command_name> for more help on a command")
                .setThumbnail(client.user.avatarURL({ dynamic: true }))
                .setAuthor(client.user.username)
                .setFooter(config.embed.footer + " | " + config.embed.ver, client.user.avatarURL({ dynamic: true }))
                .addField(prefix + "owner", "Shows who the current owner of the channel is")
                .addField(prefix + "claim", "Claim the voice chat if the owner has left")
                .addField(prefix + "rename", "allows the channel owner to rename the voice chat")
                .addField(prefix + "lock", "Locks the channel and makes it visible and joinable by those who are invited.")
                .addField(prefix + "unlock", "unlocks a voice chat and allows it to be seen and joined by anyone")
                .addField(prefix + "invite @member", "allows a mentioned member to see and join the channel");
            if (msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")) {
                embed.addField(prefix + "newcat", "Generates a new category and a join channel for that category");
                embed.addField(prefix + "template", "Updates the Channel's template");
                embed.addField(prefix + "increment", "Overrides the Channel's increment");
                embed.addField(prefix + "debug", "Debugs the bot's perms for the server or a channel");
            }

            msg.channel.send(embed);
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