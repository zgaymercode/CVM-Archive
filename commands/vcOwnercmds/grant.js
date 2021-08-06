const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    client.database.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }

        let cid = msg.member.voice.channel.id;
        let vc = msg.member.voice.channel;
        let vcmembers = vc.members;
        var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [cid]);
        d.query(sql, async (er, re) => {
            if (er) console.error(er);
            if (!re.length) return client.functions.Reply(msg, "OOF, a glitch occured. I couldn't find the entry of the voice channel your in, try agin or contact bot support");
            let stagestate = re[0].is_stage;
            let owner = re[0].oid;
            if (stagestate === 1) {
                if (args[0] === 'all') {
                    let jcid = re[0].joinchan;
                    vcmembers.each((member) => {
                        if (member.id === owner) return;
                        // delete any entries for the queue that may exists
                        client.functions.DeleteFromQueue(client, member.id);

                        //grant the perms in the channel
                        vc.updateOverwrite(
                            member,
                            {
                                STREAM: true,
                                SPEAK: true
                            }
                        )
                        let tmpchannel = client.channels.cache.get(jcid);
                        let tmpar = client.config.tmp.array;
                        tmpar.push(member.id);
                        if (msg.needsAdminLog === 1) {
                            client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `Granted ${member} Speak and Stream in ${vc.id}`)
                        }
                        client.functions.AddModLog(client, msg.guild.id, msg.author.id, `${member} Granted`, vc, '3')
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
                    })
                } else {
                    let grant = msg.mentions.members.first();
                    if (!grant) return client.functions.Reply(msg, "You must @mention a member to grant speaking/video permissions!");
                    if (grant.id === owner) return client.functions.Reply(msg, `That member is the owner, they already have speaking / streaming perms`);
                    let jcid = re[0].joinchan; // join channel id
                    let vccheck;
                    vcmembers.each((member) => {
                        if (member.id != grant.id) return;
                        vccheck = 1;
                    })
                    if (vccheck != 1) return client.functions.Reply(msg, `${grant} is not in the voice chat`);

                    // delete any entries for the queue that may exists
                    client.functions.DeleteFromQueue(client, grant.id);

                    //grant the perms in the channel
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
                    if (msg.needsAdminLog === 1) {
                        client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `Granted ${grant} Speak and Stream in ${vc.id}`)
                    }
                    client.functions.AddModLog(client, msg.guild.id, msg.author.id, `${grant} Granted`, vc, '3')
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
                    client.functions.Reply(msg, `${grant} has been allowed to speak and stream in this channel`)
                }

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
    aliases: ["partyadd"],
    description: "Grants a user the ability to speak and stream in the channel",
    usage: "grant @user",
    category: "VC Owner Command",
    cooldown: 15,
    maintenancemode: 0
}