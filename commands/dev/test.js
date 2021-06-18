const Discord = require('discord.js');
const client = new Discord.Client();
const { sep } = require('path');
const mysql = require("mysql");
const { readdirSync } = require("fs");
const SqlString = require("sqlstring");
const moment = require("moment");
const { MessageButton, MessageActionRow } = require("discord-buttons");
exports.run = async (client, msg, args) => {
    try {
        switch (args[0]) {
            case 'check':
                client.functions.vcPermsCheck(client, msg, (response) => {
                    if (response === 0) client.functions.Reply(msg, "You are not an owner or leader of this channel");
                    if (response === 1) client.functions.Reply(msg, "You are a leader of this channel")
                    client.functions.Reply(msg, "You are an owner of this channel")
                })
                break;
            case 'addleader':

                break;
            default:
                msg.channel.send("options are addleader or check");
        }
    } catch (e) {
        console.error(e);
        client.functions.Reply(msg, "There was an error in the matrix")
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