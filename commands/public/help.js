const Discord = module.require("discord.js");
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        msg.delete();
        let prefix = config.bot.prefix;
        let embedcolor = config.embed.color;

        let embed = new Discord.MessageEmbed()
            .setColor(embedcolor)
            .setTimestamp()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setAuthor(client.user.username, client.user.avatarURL({ dynamic: true }))
            .setFooter(config.embed.footer + " | " + config.embed.ver, client.user.avatarURL({ dynamic: true }))
            .addField(config.bot.prefix + "owner", "Shows who the current owner of the channel is")
            .addField(config.bot.prefix + "claim", "Claim the voice chat if the owner has left")
            .addField(config.bot.prefix + "rename", "allows the channel owner to rename the voice chat")
            .addField(config.bot.prefix + "lock", "Locks the channel and makes it visible and joinable by those who are invited.")
            .addField(config.bot.prefix + "unlock", "unlocks a voice chat and allows it to be seen and joined by anyone")
            .addField(config.bot.prefix + "invite", "allows a mentioned member to see and join the channel");
        if (msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")) {
            embed.addField(config.bot.prefix + "newcat", "Generates a new category and a join channel for that category");
            embed.addField(config.bot.prefix + "debug", "Debugs the bot's perms for the server or a channel");
        }
        
        msg.channel.send(embed);
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "help",
    aliases: ["h"],
    description: "Help",
    usage: "",
    category: "General"
}