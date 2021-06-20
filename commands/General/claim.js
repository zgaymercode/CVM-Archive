const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring');
async function UpdateOwner(d, msg, fn, vc) {
    var sql = SqlString.format(`UPDATE channels SET oid=? WHERE id=?`, [msg.author.id, vc.id]);
    d.query(sql, async (er, ro) => {
        if (er) console.error(er);
        if (!ro) fn.Reply(msg, "Could not claim channel");
        if (ro) fn.Reply(msg, "you have successfully claimed this channel");
    })
}
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
        if (msg.member.voice.channel) {
            let uid = msg.author.id;
            let vc = msg.member.voice.channel;

            var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [vc.id]);
            con.getConnection(function (err, d) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                d.query(sql, async (er, re) => {
                    if (er) console.error(er);
                    if (!re) return;
                    if (re) {
                        let OwnerID = re[0].oid;
                        let isownerstillinchat;
                        for (const [memberID] of vc.members) {
                            if (memberID === OwnerID) {
                                isownerstillinchat = 1;
                                break;
                            } else {
                                continue;
                            }
                        }
                        if (isownerstillinchat === 1) {
                            if (msg.member.hasPermission("MOVE_MEMBERS") || msg.member.hasPermission("ADMINISTRATOR")) {
                                client.functions.AddModLog(client, msg.guild.id, msg.author.id, 'Force Claimed channel', vc, '2')
                                client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `Force Claimed vc: '${vc.name}'`)
                                UpdateOwner(d, msg, fn, vc)
                            } else {
                                fn.Reply(msg, config.messages.ownerstillpresent)
                            }
                        } else {
                            client.functions.AddModLog(client, msg.guild.id, msg.author.id, 'Claimed channel', vc, '2')
                            UpdateOwner(d, msg, fn, vc)
                        }
                    }
                })
                d.release(function (err) {
                    if (err) {
                        ErrorMessage("close connection", err);
                    }
                    console.info("Ended Connection");
                    // The connection is terminated now
                });
            });
        } else {
            fn.Reply(msg, "You are not in a voice channel")
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "claim",
    //aliases: [""],
    description: "Claims a voice chat when the owner has left. Members with Move Members or Administrator will bypass all checks in this command and claim by force",
    usage: "claim",
    category: "General",
    maintenancemode: 0
}