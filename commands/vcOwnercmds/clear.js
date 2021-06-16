const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    /*
        reset's channel overrides to disallow all members except chowner
        from speaking/video chatting
    */
    console.log(msg.member.voice.channel)
}
module.exports.help = {
    name: "clear",
    //aliases: [""],
    description: "Resets an activity voice channel's permissions to just the owner being able to speak/stream",
    usage: "clear",
    category: "VC Owner Command",
    maintenancemode: 1
}