
const Discord = require('discord.js');
const client = new Discord.Client();
const { sep } = require('path');
const mysql = require("mysql");
const { readdirSync } = require("fs");
const SqlString = require("sqlstring");
const moment = require("moment");
exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
         fn.Reply(msg, "This command is blank")
    } catch (e) {
        console.error(e);
        fn.Reply(msg, "There was an error in the matrix")
    }
};
module.exports.help = {
    name: "test",
    //aliases: [""],
    description: "Command Space for testing new functions / commands",
    usage: "test",
    category: "Dev",
    maintenancemode: 0
}
/*
Add This to the category when Working on commands to put the Reply message as "This command is under construction"
change =>
    maintenancemode: 1
when done =>
    maintenancemode: 0

*/