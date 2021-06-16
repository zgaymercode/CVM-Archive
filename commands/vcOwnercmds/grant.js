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
            if (stagestate === 1) {
                let grant = msg.mentions.members.first();
                if (!grant) return client.functions.Reply(msg, "You must @mention a member to grant speaking/video permissions!");
                let jcid = re[0].joinchan; // join channel id 
                let vcmembers = msg.member.voice.channel;
                let vccheck;
                vcmembers.members.each((member) => {
                    if (member.id != grant.id) return;
                    vccheck = 1;
                })
                if (vccheck != 1) return client.functions.Reply(msg, `<@${grant.id}> is not in the voice chat`);
                vc.updateOverwrite(
                    grant,
                    {
                        STREAM: true,
                        SPEAK: true
                    }
                )
                let tmpchannel = client.channels.cache.get(jcid);
                let tmpar = client.config.tmp.array;
                tmpar.push(grant.id);
                grant.voice.setChannel(tmpchannel).then(() => {
                    tmpchannel.members.each((memberintmp) => {
                        if (memberintmp.id != grant.id) return;
                        setTimeout(() => {
                            grant.voice.setChannel(vc);
                            for (var i = 0; i < tmpar.length; i++) {
                                if (tmpar[i] === grant.id) {
                                    tmpar.splice(i, 1);
                                }
                            }
                        }, 1000);
                    })

                })
                client.functions.Reply(msg, `<@${grant.id}> has been allowed to speak and stream in this channel`)

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
    name: "grant",
    //aliases: [""],
    description: "Grants a user the ability to speak and stream in the channel",
    usage: "grant @user",
    category: "VC Owner Command",
    maintenancemode: 0
}