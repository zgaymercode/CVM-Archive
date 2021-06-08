const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    /*
        allow's mentioned user to speak & use video in the current channel
    */
}
module.exports.help = {
    name: "grant",
    //aliases: [""],
    description: "Grants a user the ability to speak and ",
    usage: "grant @user",
    category: "VC Owner Command",
    maintenancemode: 1
}