const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    /*
        reset's channel overrides to disallow all members except chowner
        from speaking/video chatting
    */
}
module.exports.help = {
    name: "clear",
    //aliases: [""],
    description: "tbd",
    usage: "clear",
    category: "VC Owner Command",
    maintenancemode: 1
}