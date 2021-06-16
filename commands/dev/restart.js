const Discord = require("discord.js")
const fs = require("fs");
const mysql = module.require("mysql");

exports.run = (client, msg, args) => {
    const { exec } = require('child_process');
    exec('git stash --include-untracked && git reset--hard && git clean - fd && git pull', (error, stdout, stderr) => {
        msg.channel.send(`Git Pull response: ${stdout}    Restarting now`).then((m) => {
            setTimeout(() => {
                m.delete();
                setTimeout(function () {
                    process.exit(1);
                }, 100)
            }, 5000);
        });
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });
       
};
module.exports.help = {
    name: "restart",
    //aliases: [""],
    description: "restarts the bot",
    usage: "restart",
    category: "Dev",
    maintenancemode: 0
}