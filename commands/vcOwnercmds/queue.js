const Discord = module.require('discord.js')
const SqlString = module.require('sqlstring')
const { MessageButton, MessageActionRow } = require("discord-buttons");
const { fn } = require("moment");

async function GrantNext(client, msg, grant, vc, oid, jcid) {
    // clear the channel's permissions
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
    client.functions.AddModLog(client, msg.guild.id, msg.author.id, `<@${grant.id}> Granted`, vc, '3')
    if (msg.needsAdminLog === 1) {
        client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `Granted <@${grant.id}> to speak & stream in ${vc.id}`)
    }
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
}
module.exports.run = async (client, msg, args) => {
    // Define the reactions (if you modify these, modify them in the messageReactionAdd event as well)
    try {
        let vcid = msg.member.voice.channel.id;
        let vc = msg.member.voice.channel;
        var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [vcid]);
        client.database.getConnection(function (err, d) {
            if (err) {
                console.error("error connecting: " + err.stack);
                return;
            }
            client.functions.isTmpVC(client, msg, (istmpvc) => {
                if (!istmpvc) return;
                client.functions.isActivityVC(client, msg, (isActivityVC) => {
                    if (!isActivityVC) return;
                    client.database.getConnection(async (connection_error, d) => {
                        if (connection_error) return console.error(connection_error.stack);
                        switch (args[0]) {
                            case 'next':
                                var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [vcid]);
                                d.query(sql, async (er, re) => {
                                    if (er) console.error(er);
                                    if (!re.length) return client.functions.Reply(msg, "OOF, a glitch occured. I couldn't find the entry of the voice channel your in, try agin or contact bot support");
                                    let jcid = re[0].joinchan
                                    let oid = re[0].oid;
                                    // Findout who's next
                                    let QueueNext = SqlString.format(`SELECT * FROM queue WHERE vcid=? ORDER BY created ASC LIMIT 1`, [vcid]);
                                    d.query(QueueNext, async (QueueNext_error, QueueNext_result) => {
                                        if (QueueNext_error) console.error(QueueNext_error);
                                        if (!QueueNext_result.length) return;
                                        let grantid = QueueNext_result[0].userid;
                                        grant = msg.guild.members.cache.get(grantid);
                                        let vcmembers = msg.member.voice.channel;
                                        let vccheck;
                                        vcmembers.members.each((member) => {
                                            if (member.id != grantid) return;
                                            vccheck = 1;
                                        })
                                        if (vccheck != 1) {
                                            client.functions.Reply(msg, `<@${grant.id}> is no longer in the voice chat. \n`);
                                            client.functions.DeleteFromQueue(client, grantid);
                                            GrantNext(client, msg, grant, vc, oid, jcid)
                                        }
                                        GrantNext(client, msg, grant, vc, oid, jcid)
                                    })
                                })
                                break;
                            case 'remove':
                                let target = msg.mentions.members.first();
                                if (!target) client.functions.Reply(msg, `Invalid arguments: you must @mention a member you wish to remove`);
                                client.functions.DeleteFromQueue(client, target.id);
                                client.functions.Reply(msg, `Successfully removed <@${target.id}> from the queue`)
                                break;
                            case 'clear':
                                let ClearSQL = SqlString.format(`DELETE FROM queue WHERE vcid=?`, [vcid]);
                                d.query(ClearSQL, (ClearSQL_error, ClearSQL_results) => {
                                    if (ClearSQL_error) console.error(ClearSQL_error);
                                    client.functions.Reply(msg, `Successfully Cleared the queue`)
                                })
                                break;
                            default:
                                client.functions.Reply(msg, `Invalid Input provided. valid options are next/clear/remove   try the help command if you need more assistance`)
                        }
                        d.release(function (releaseerror) { if (releaseerror) console.error(releaseerror); });
                    });

                })
            })
            d.release(function (err) {
                if (err) {
                    console.error(err);
                }
            });
        });


    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "queue",
    //aliases: [""],
    description: `Allows the owner of a channel to manage the queue of their activity channel. appending next will clear the channel's permissions and grant the next in queue. apending clear will clear the queue for the channel. remove will remove a member from the queue`,
    usage: "queue next | clear | remove",
    category: "VC Owner Command",
    cooldown: 0,
    maintenancemode: 0
}