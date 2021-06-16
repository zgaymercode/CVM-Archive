const config = require("../../config");

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
            let stagestate = re[0].is_stage;
            let jcid = re[0].joinchan;
            if (stagestate === 1) {
                let deny = msg.mentions.members.first();
                if (!deny) return client.functions.Reply(msg, "You must @mention a member to deny speaking/video permissions!");
                let vcmembers = msg.member.voice.channel;
                let vccheck;
                vcmembers.members.each((member) => {
                    if (member.id != deny.id) return;
                    vccheck = 1;
                })
                if (vccheck != 1) return client.functions.Reply(msg, `<@${deny.id}> is not in the voice chat`);
                let overwrites = vc.permissionOverwrites.get(deny.id);
                if (!overwrites) return client.functions.Reply(msg, `<@${deny.id}> is not currently granted speak/stream permissions`);
                overwrites.delete();
                let tmpchannel = client.channels.cache.get(jcid);
                let tmpar = client.config.tmp.array;
                tmpar.push(deny.id);
                deny.voice.setChannel(tmpchannel).then(() => {
                    tmpchannel.members.each((memberintmp) => {
                        if (memberintmp.id != deny.id) return;
                        setTimeout(() => {
                            deny.voice.setChannel(vc);
                            for (var i = 0; i < tmpar.length; i++) {
                                if (tmpar[i] === deny.id) {
                                    tmpar.splice(i, 1);
                                }
                            }
                        }, 1000);
                    })

                })
                client.functions.Reply(msg, `<@${deny.id}> has been denied from speaking and streaming in this channel`)

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
    name: "deny",
    //aliases: [""],
    description: "revokes a users ability to speak and use video in stage channels",
    usage: "deny @user",
    category: "VC Owner Command",
    maintenancemode: 0
}