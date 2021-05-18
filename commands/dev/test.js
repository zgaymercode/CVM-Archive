
const Discord = require('discord.js');
const client = new Discord.Client();
const { sep } = require('path');
const mysql = require("mysql");
const { readdirSync } = require("fs");
const SqlString = require("sqlstring");
const moment = require("moment");
exports.run = async (client, con, config, msg, args, fn) => {
    try {
       
    } catch (e) {
        console.error(e)
        fn.Reply(msg, "Welp, That failed")
    }
};
module.exports.help = {
    name: "test",
    //aliases: [""],
    description: "Command Space for testing new functions / commands",
    usage: "test",
    category: "Dev"
}
/*
Add This when Working on commands to put the Reply message as "This command is under construction"
"Under Maintenance"//

*/