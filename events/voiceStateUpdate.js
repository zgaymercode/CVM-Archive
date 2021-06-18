const { PermissionOverwrites } = require("discord.js");
const SqlString = require("sqlstring");
const { consolelog } = require("../functions");
module.exports = async (client, oldState, newState) => {
    let fn = client.functions;
    let config = client.config;
    let con = client.database;
    if (oldState.id === newState.id) {
        if (oldState.channelID != newState.channelID) {
            let uid = oldState.id;
            if (client.config.tmp.array.includes(uid)) return;
            let channelid = newState.channelID;
            let oldchan = oldState.channelID;
            if (oldchan === channelid) return;
            con.getConnection(function (err, d) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                //#region Join chan's
                var sql = SqlString.format('SELECT * FROM joinchans WHERE joinchan=?', [channelid]);
                d.query(sql, async (er, res) => {
                    if (er) console.error(er);
                    if (!res.length) return;
                    let guild = client.channels.cache.get(newState.channelID).guild;
                    let u = client.users.cache.get(uid);
                    let m = guild.members.cache.get(uid);
                    let t = res[0].template;
                    let inc = res[0].increment;
                    let lockable = res[0].lockable;
                    let stage = res[0].is_stage;
                    let limit = res[0].adjust_limit;
                    if (t === null) {
                        template = `${u.username}'s Room`;
                    } else {
                        let game;
                        // use the user generated template
                        let activities = m.user.presence.activities;
                        for (let i = 0; i < activities.length; i++) {
                            let act = activities[i];
                            if (act.type === "PLAYING") {
                                game = act.name;
                                break;
                            } else {
                                continue;
                            }
                        }
                        if (!m.nickname) {
                            displayname = u.username;
                        } else {
                            displayname = m.nickname;
                        }
                        if (!game) game = "No Game Detected";
                        let PreStep = t.replace(/%GAME%/g, game);
                        let step1 = PreStep.replace(/%USERNAME%/g, u.username)
                        let step2 = step1.replace(/%INC%/g, inc + 1);
                        template = step2.replace(/%NICKNAME%/g, displayname)
                        d.query(`UPDATE joinchans SET increment = increment + 1 WHERE joinchan='${channelid}'`, (er3, res3) => {
                            if (er3) console.error(er3);
                            return;
                        });
                    }
                    let newchan = await newState.guild.channels.create(template, {
                        type: 'voice',
                        parent: newState.channel.parent.id,
                        userLimit: newState.channel.userLimit,
                        permissionOverwrites: newState.channel.permissionOverwrites
                    });
                    if (stage === 1) {
                        newchan.updateOverwrite(
                            u.id,
                            {
                                STREAM: true,
                                SPEAK: true
                            }
                        )
                    }
                    var sql2 = SqlString.format('INSERT INTO channels SET id=?, joinchan=?, oid=?, is_stage=?, adjust_limit=?, created=CURRENT_TIMESTAMP()', [newchan.id, channelid, uid, stage, limit]);
                    d.query(sql2, async (er2, res2) => {
                        if (er2) console.error(er);
                        if (!res2) console.error(er2);
                        if (res2) console.log("New channel created");
                        if (newState.channel.userLimit != 0) {
                            // if the channel is anything other than 0 we need to log it, otherwise, we don't need it :3
                            client.functions.AddModLog(client, guild.id, m.id, `Created "${newchan.name}" Limit: "${newState.channel.userLimit}"`, newchan, '1')
                        } else {
                            client.functions.AddModLog(client, guild.id, m.id, `Created "${newchan.name}"`, newchan, '1')
                        }
                        
                    });
                    setTimeout(() => {
                        newState.setChannel(newchan);
                    }, 500);
                });
                //#endregion
                //#region Temp Chan Deletes
                var sql4 = SqlString.format('SELECT * FROM channels WHERE id=?', [oldchan]);
                d.query(sql4, async (er, res) => {
                    if (er) console.error(er);
                    if (!res.length) return;
                    let vc = oldState.guild.channels.cache.get(oldState.channelID);
                    if (vc.members.size < 1) {
                        vc.delete()
                        if (oldState.channel.userLimit != 0) {
                            // if the channel is anything other than 0 we need to log it, otherwise, we don't need it :3
                            client.functions.AddModLog(client, oldState.guild.id, uid, `Deleted "${vc.name}" Limit: "${oldState.channel.userLimit}"`, vc, '0')
                        } else {
                            client.functions.AddModLog(client, oldState.guild.id, uid, `Deleted "${vc.name}"`, vc, '0')
                        }
                        client.functions.SendModLog(client, oldState.guild.id, vc.id);
                        // yeet the info from the database
                        let sqlzor = SqlString.format('DELETE FROM channels WHERE id=?', [oldchan]);
                        d.query(sqlzor, async (er, res234) => {
                            if (er) console.error(er);
                            if (!res234) console.error("Could not delete entry");
                            
                            
                        })
                        
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
    }
}