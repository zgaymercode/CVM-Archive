
const Discord = require('discord.js');
const client = new Discord.Client();
const { sep } = require('path');
const mysql = require("mysql");
const { readdirSync } = require("fs");
const SqlString = require("sqlstring");
const moment = require("moment");
exports.run = (client, con, config, msg, args, fn) => {
    try {
        msg.delete();
        msg.channel.send("This command is empty <3")
    } catch {
        fn.Reply(msg, "Welp, That failed")
    }
};
module.exports.help = {
    name: "test",
    //aliases: [""],
    description: "Test command for Dev tasks",
    usage: "test",
    category: "Dev"
}