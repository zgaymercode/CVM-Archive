const SqlString = require("sqlstring");
module.exports.run = async (client, msg, args) => {
    try {

        if (!msg.mentions.channels) return client.functions.Reply(msg, `You must mention a channel to set as the log chanenl`)
        client.database.getConnection(function (err, d) {
            if (err) {
                console.error("error connecting: " + err.stack);
                return;
            }
            let logchannelID = msg.mentions.channels.first().id;
            let updateServerSQL;
            switch (args[0]) {
                case 'admin':
                    updateServerSQL = SqlString.format(`UPDATE servers SET adminlog=? WHERE id=?`, [logchannelID, msg.guild.id]);
                    d.query(updateServerSQL, (error, result) => {
                        if (error) return console.error(error);
                        if (!result) return client.functions.Reply(msg, "Could not update admin log channel");
                        client.functions.Reply(msg, `Successfully set admin Log to <#${logchannelID}>`);
                        client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `Updated Admin log to <#${logchannelID}>`);
                    })
                    break;
                case 'mod':
                    updateServerSQL = SqlString.format(`UPDATE servers SET modlog=? WHERE id=?`, [logchannelID, msg.guild.id]);
                    d.query(updateServerSQL, (error, result) => {
                        if (error) return console.error(error);
                        if (!result) return client.functions.Reply(msg, "Could not update Mod log channel");
                        client.functions.Reply(msg, `Successfully set Mod Log to <#${logchannelID}>`);
                        client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `Updated Mod log to <#${logchannelID}>`);
                    })
                    break;
                default:
                    client.functions.Reply(msg, "You must state whether you'd like to update admin log channel or mod log channel, see help command for more info");
                    break;
            }


            d.release(function (err) {
                if (err) {
                    console.error(err);
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
}
module.exports.help = {
    name: "logchannel",
    aliases: ["logchan"],
    description: "Sets the channel for the bot to send modlogs/adminlogs into",
    usage: "logchan admin|mod #channel",
    category: "Administrative",
    cooldown: 0,
    maintenancemode: 1
}