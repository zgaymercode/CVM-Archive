const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    /*
        revokes's mentioned user's access to speak & use video in the current channel
    */
}
module.exports.help = {
    name: "deny",
    //aliases: [""],
    description: "revokes a users ability to speak and use video in stage channels",
    usage: "deny @user",
    category: "VC Owner Command",
    maintenancemode: 1
}