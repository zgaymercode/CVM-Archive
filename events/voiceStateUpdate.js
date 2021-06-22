const { PermissionOverwrites } = require("discord.js");
const SqlString = require("sqlstring");
const { consolelog } = require("../functions");
module.exports = async (client, oldState, newState) => {
    if (oldState.id === newState.id) {
        if (oldState.channelID != newState.channelID) {
            let uid = oldState.id;
            if (client.config.tmp.array.includes(uid)) return;
            let channelid = newState.channelID;
            let oldchan = oldState.channelID;
            if (oldchan === channelid) return;
            client.database.getConnection(function (err, d) {
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
                    let userObject = client.users.cache.get(uid);
                    let memberObject = guild.members.cache.get(uid);
                    let template = res[0].template;
                    let prefix = res[0].prefix;
                    let inc = res[0].increment;
                    let autolock = res[0].autolock;
                    let lockable = res[0].lockable;
                    let stage = res[0].is_stage;
                    let limit = res[0].adjust_limit;
                    if (template === null) {
                        template = `${userObject.username}'s Room`;
                    } else {
                        let game;
                        // use the user generated template
                        let activities = memberObject.user.presence.activities;
                        for (let i = 0; i < activities.length; i++) {
                            let act = activities[i];
                            if (act.type === "PLAYING") {
                                game = act.name;
                                break;
                            } else {
                                continue;
                            }
                        }
                        if (!memberObject.nickname) {
                            displayname = userObject.username;
                        } else {
                            displayname = memberObject.nickname;
                        }
                        if (!game) game = "No Game Detected";
                        let PreStep = template.replace(/%GAME%/g, game);
                        let step1 = PreStep.replace(/%USERNAME%/g, userObject.username)
                        let step2 = step1.replace(/%INC%/g, inc + 1);
                        template = step2.replace(/%NICKNAME%/g, displayname)
                        if (prefix === null) prefix = '';
                        VoiceChannelName = `${prefix} ${template}`;
                        d.query(`UPDATE joinchans SET increment = increment + 1 WHERE joinchan='${channelid}'`, (er3, res3) => {
                            if (er3) console.error(er3);
                            return;
                        });
                    }
                    let newchan = await newState.guild.channels.create(VoiceChannelName, {
                        type: 'voice',
                        parent: newState.channel.parent.id,
                        userLimit: newState.channel.userLimit,
                        permissionOverwrites: newState.channel.permissionOverwrites
                    });
                    if (stage === 1) {
                        newchan.updateOverwrite(
                            userObject.id,
                            {
                                STREAM: true,
                                SPEAK: true
                            }
                        )
                    }
                    if (autolock === 1) {
                        newchan.updateOverwrite(
                            guild.roles.everyone.id,
                            {
                                CONNECT: false
                            }
                        )
                        newchan.updateOverwrite(
                            userObject.id,
                            {
                                CONNECT: true
                            },
                        )
                    }
                    
                    let obj = '{"coowners": []}';
                    var sql2 = SqlString.format('INSERT INTO channels SET id=?, joinchan=?, oid=?, is_stage=?, adjust_limit=?, coowner=?, locked=?, created=CURRENT_TIMESTAMP()', [newchan.id, channelid, uid, stage, limit, obj, autolock]);
                    d.query(sql2, async (er2, res2) => {
                        if (er2) console.error(er);
                        if (!res2.length < 1) return
                        if (newState.channel.userLimit != 0) {
                            // if the channel is anything other than 0 we need to log it, otherwise, we don't need it :3
                            client.functions.AddModLog(client, guild.id, memberObject.id, `Created "${newchan.name}" Limit: "${newState.channel.userLimit}"`, newchan, '1')
                        } else {
                            client.functions.AddModLog(client, guild.id, memberObject.id, `Created "${newchan.name}"`, newchan, '1')
                        }

                    });
                    setTimeout(() => {
                        newState.setChannel(newchan);
                    }, 500);
                });
                //#endregion
                //#region Input Timestamp for OwnerLeave
                let findstatus = SqlString.format(`SELECT * FROM channels WHERE id=? AND oid=?`, [oldchan, uid]);
                d.query(findstatus, (find_Error, channelsresults) => {
                    if (find_Error) return console.error(find_Error);
                    if (channelsresults.length < 1) return;
                    let addtimestamp = SqlString.format(`UPDATE channels SET ownerleavetimestamp=CURRENT_TIMESTAMP() WHERE id=?`, [oldchan]);
                    d.query(addtimestamp, (errorTimeStampEntry, resultsTimeStampEntry) => {
                        if (errorTimeStampEntry) console.log(errorTimeStampEntry);
                    })

                })
                //#endregion
                //#region Owner leave reset
                /* if the owner returns before the timestamp is set to null, this set's it to null */
                let setNullTimestamp = SqlString.format(`UPDATE channels SET ownerleavetimestamp=null WHERE oid=? AND id=?`, [uid, newState.channelID]);
                d.query(setNullTimestamp, (setNullError, setNullResults) => {
                    if (setNullError) console.error(setNullError);
                    if (setNullResults) return;
                })
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
                        setTimeout(() => {
                            client.functions.SendModLog(client, oldState.guild.id, vc.id);
                        }, 1000);
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