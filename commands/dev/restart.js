const Discord = require("discord.js")
const fs = require("fs");
const mysql = module.require("mysql");

exports.run = (client, con, config, msg, args, fn) => {
    msg.channel.send("RESTARTING NOW!!!").then((m) => {
        setTimeout(() => {
            m.delete();
            setTimeout(function () {
                process.exit(1);
            }, 100)
        }, 2000);
    });   
};
module.exports.help = {
    name: "restart",
    //aliases: [""],
    description: "restarts the bot",
    usage: "restart",
    category: "Dev"
}