
const Discord = module.require("discord.js");
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        if (msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")) {
           
            let arg = msg.mentions.channels.first();
            if (arg) {
                let embed = new Discord.MessageEmbed()
                    .setColor(config.embed.color)
                    .setTimestamp()
                    .setAuthor(client.user.username, client.user.avatarURL({ dynamic: true }))
                    .setDescription("This command should allow you to Check whether the bot has the correct perms in <#" + arg.id + ">")
                    .setFooter(config.embed.footer + " | " + config.embed.ver, client.user.avatarURL({ dynamic: true }));


                //debugging a certain channel
                let pbits = arg.permissionsFor(msg.guild.me).serialize();
                // REQUIRED PERMS
                if (pbits.MANAGE_CHANNELS) {
                    embed.addField("Manage Channels", "✅ Good!", true)
                } else {
                    embed.addField("Manage Channels", "❌ I do not have this permission! I use this to Create and Manage voice chats")
                }
                if (pbits.MANAGE_MESSAGES) {
                    embed.addField("Manage Messages", "✅ Good!", true)
                } else {
                    embed.addField("Manage Messages", "❌ I do not have this permission! I use this to delete the message author's command")
                }
                if (pbits.MOVE_MEMBERS) {
                    embed.addField("Move Members", "✅ Good!", true)
                } else {
                    embed.addField("Move Members", "❌ I do not have this permission! I use this when members create a new channel")
                }
                msg.channel.send(embed).then((m) => {
                    setTimeout(() => {
                        m.delete()
                    }, 10000);
                })
            } else {
                let embed = new Discord.MessageEmbed()
                    .setColor(config.embed.color)
                    .setTimestamp()
                    .setAuthor(client.user.username, client.user.avatarURL({ dynamic: true }))
                    .setDescription("This command should allow you to Check whether the bot has the correct perms in this server.")
                    .setFooter(config.embed.footer + " | " + config.embed.ver, client.user.avatarURL({ dynamic: true }));


                // REQUIRED PERMS
                if (msg.guild.me.hasPermission('MANAGE_CHANNELS')) {
                    embed.addField("Manage Channels", "✅ Good!", true)
                } else {
                    embed.addField("Manage Channels", "❌ I do not have this permission! I use this to Create and Manage voice chats")
                }
                if (msg.guild.me.hasPermission('MANAGE_MESSAGES')) {
                    embed.addField("Manage Messages", "✅ Good!", true)
                } else {
                    embed.addField("Manage Messages", "❌ I do not have this permission! I use this to delete the message author's command")
                }
                if (msg.guild.me.hasPermission('MOVE_MEMBERS')) {
                    embed.addField("Move Members", "✅ Good!", true)
                } else {
                    embed.addField("Move Members", "❌ I do not have this permission! I use this when members create a new channel")
                }

                msg.channel.send(embed).then((m) => {
                    setTimeout(() => {
                        m.delete()
                    }, 10000);
                });
            }
            
        } else {
            fn.Reply(msg, config.messages.nomanager);
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "debug",
    //aliases: [""],
    description: "Debugs the server's permissions or the mentioned channel's permissions",
    usage: "cvdebug OR cvdebug #channel",
    category: "General"
}