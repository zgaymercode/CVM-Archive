const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    client.database.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        let cid = msg.member.voice.channel.id;
        let vc = msg.member.voice.channel;
        var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [cid]);
        d.query(sql, async (er, re) => {
            if (er) console.error(er);
            if (!re.length) return client.functions.Reply(msg, "OOF, a glitch occured. I couldn't find the entry of the voice channel your in, try agin or contact bot support");
            let stagestate = re[0].is_stage; // is the channel an activity channel?
            let jcid = re[0].joinchan; // join channel id 
            let oid = re[0].oid; // owner id
            if (stagestate === 1) {
                let vcmembers = msg.member.voice.channel;
                vcmembers.members.each((member) => {
                    if (member.id === oid) return; // ignore the owner
                    if (member.id === client.user.id) return; // just incase the bot is in the vc
                    if (!vc.permissionOverwrites.get(member.id)) return;
                    vc.permissionOverwrites.get(member.id).delete();
                    let tmpchannel = client.channels.cache.get(jcid);
                    let tmpar = client.config.tmp.array;
                    tmpar.push(member.id);
                    member.voice.setChannel(tmpchannel).then(() => {
                        tmpchannel.members.each((memberintmp) => {
                            if (memberintmp.id != member.id) return;
                            setTimeout(() => {
                                member.voice.setChannel(vc);
                                for (var i = 0; i < tmpar.length; i++) {
                                    if (tmpar[i] === member.id) {
                                        tmpar.splice(i, 1);
                                    }
                                }
                            }, 1000);
                        })
                    })
                });

                client.functions.Reply(msg, `Voice chat has been cleared of all permission overwrites`)

            } else {
                client.functions.Reply(msg, "Sorry, this is a Activity Voice feature. You must be in a voice chat with this enabled")
            }
        })
        //#endregion
        d.release(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}
module.exports.help = {
    name: "clear",
    //aliases: [""],
    description: "Resets an activity voice channel's permissions to just the owner being able to speak/stream",
    usage: "clear",
    category: "VC Owner Command",
    maintenancemode: 0
}