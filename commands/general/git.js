const Discord = module.require("discord.js");
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        let embed = new Discord.MessageEmbed()
            .setColor(config.embed.color)
            .setDescription('[Click here to view ' + client.user.username + "'s github link](" + config.bot.giturl + ")");
        msg.channel.send(embed).then((m) => {
            setTimeout(() => {
                m.delete()
            }, 15000);
        })
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "github",
    aliases: ["git"],
    description: "Displays the GitHub link for this bot",
    usage: "github",
    category: "General"
}