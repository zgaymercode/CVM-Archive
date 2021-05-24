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
module.exports.run = async (client, con, config, msg, args, fn) => {
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
                        let oid = re[0].oid;
                        for (const [memberID] of vc.members) {
                            if (memberID === oid) {
                                v = 1;
                                break;
                            } else {
                                continue;
                            }
                        }
                        if (v === 1) {
                            let checkperm = fn.vcOwnerCheck(vc.id, uid, msg);
                            if (checkperm) {
                                UpdateOwner(d, msg, fn, vc)
                            } else {
                                fn.Reply(msg, config.messages.ownerstillpresent)
                            }
                        } else {
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
    description: "Claims a voice chat when the owner has left",
    usage: "claim",
    category: "General"
}