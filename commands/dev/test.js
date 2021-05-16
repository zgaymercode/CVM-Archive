const Discord = require("discord.js")
const fs = require("fs");
const mysql = module.require("mysql");

exports.run = async (client, con, config, msg, args, fn) => {
    msg.delete()
    
};
module.exports.help = {
    name: "test",
    //aliases: [""],
    description: "Developer Test Command",
    usage: "",
    category: "Dev"
}