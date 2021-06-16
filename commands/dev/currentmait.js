const Discord = require("discord.js")
const fs = require("fs");
const mysql = module.require("mysql");

exports.run = (client, msg, args) => {
    let prefix = client.config.bot.prefix;
    let embed = new Discord.MessageEmbed()
        .setColor(client.config.embed.color)
        .setDescription("These commands are currently in Maintenance Mode")
        .setTitle("Maintenance Mode Commands")
    let cmds = client.commands.values();
    for (var cm of cmds) {
        let name = cm.help.name;
        let description = cm.help.description;
        let category = cm.help.category;
        let usage = cm.help.usage;
        let mmode = cm.help.maintenancemode;
        switch (mmode) {
            case 1:
                embed.addField(`${prefix}${name}`, `Description: ${description} \n Catagory: ${category} \n Usage: ${usage}`);
                break;
            default:
                break;
        }

    }
    msg.channel.send(embed);
};
module.exports.help = {
    name: "maintenancemode",
    aliases: ["maitcmds"],
    description: "Lists all commands that are currently in Maitenance Mode",
    usage: "maintenancemode",
    category: "Dev",
    maintenancemode: 0
}