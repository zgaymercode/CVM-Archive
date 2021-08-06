const SqlString = module.require('sqlstring');
async function UpdateOwner(client, d, msg, fn, vc) {
    var sql = SqlString.format(`UPDATE channels SET oid=?, ownerleavetimestamp=null WHERE id=?`, [msg.author.id, vc.id]);
    d.query(sql, async (er, ro) => {
        if (er) console.error(er);
        if (!ro) fn.Reply(msg, "Could not claim channel");
        if (ro) {
            fn.Reply(msg, "you have successfully claimed this channel")
            if (msg.premiumPerms.rename == 0) {
                var sql2 = SqlString.format(`SELECT joinchan FROM channels WHERE id=?`, [vc.id])
                d.query(sql2, async (err, ress) => {
                    if (err) console.error(err);
                    if (!ress) console.error(`Could not find ${vc.id}'s join channel in databse`);
                    var joinchan = ress[0].joinchan;
                    var sql3 = SqlString.format(`SELECT template,prefix,increment from joinchans WHERE joinchan = ?`, [joinchan]);
                    d.query(sql3, async (error3, result3) => {
                        if (error3) console.error(error3);
                        if (!result3) console.error(`No results found in Joinchannel Table for ${joinchan} from voicechannel: ${vc.id}`);
                        let prefix = result3[0].prefix;
                        let template = result3[0].template;
                        let inc = result3[0].increment;
                        let userObject = client.users.cache.get(msg.author.id);
                        let memberObject = msg.guild.members.cache.get(msg.author.id);

                        if (template === null) {
                            VoiceChannelName = `${userObject.username}'s Room`;

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
                            vc.setName(`${VoiceChannelName}`, `Channel Claimed by: ${msg.author.username}`);
                        }

                    })
                })
            }
        };
    })
}
async function removeCoOwnerfromCoOwnerList(d, NewOwnerId, CurrentOwnersArray, channel_id) {
    ArrayofModifiedCoOwners = [];
    for (let i = 0; i < CurrentOwnersArray.length; i++) {
        if (CurrentOwnersArray[i] === NewOwnerId) continue;
        ArrayofModifiedCoOwners.push(`"${CurrentOwnersArray[i]}"`);
    }

    let NewDBOwnerObject = `{"coowners": [${ArrayofModifiedCoOwners}]}`
    let sql = SqlString.format(`UPDATE channels SET coowner=? where id=?`, [NewDBOwnerObject, channel_id])
    d.query(sql, (error, results) => {
        if (error || results.length < 1) return console.error("There was an error updating the co-owner array on claim command");
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
                    if (re.length > 0) {
                        client.functions.ModPermsCheck(msg, (modperms) => {
                            if (modperms) {
                                client.functions.AddModLog(client, msg.guild.id, msg.author.id, `Force Claimed by: <@${msg.author.id}> `, vc, '2')
                                client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `Force Claimed vc: '${vc.name} \n id: ${vc.id}'`)
                                UpdateOwner(client, d, msg, fn, vc)
                            } else {
                                let ownerleavetimestamp = re[0].ownerleavetimestamp
                                let retrieveCoOwnersObj = re[0].coowner;
                                let jsonObjectFromDB = JSON.parse(retrieveCoOwnersObj)
                                let CurrentOwnersArray = jsonObjectFromDB.coowners || [];
                                if (ownerleavetimestamp != null) {
                                    let timesinceleave = client.functions.timesince(ownerleavetimestamp);
                                    let cooldown = config.bot.ownerleavecooldown;

                                    if (timesinceleave < cooldown) {
                                        // Time Since owner is less than the cooldown
                                        let timeleft = cooldown - timesinceleave;
                                        if (timeleft < 0) {
                                            timeleft = timeleft * -1;
                                        }
                                        fn.Reply(msg, `Sorry, But there is still ${timeleft} Minutes left before you can claim this channel`);

                                    } else {
                                        // Check for Co-Owners first before allowing anyone to claim
                                        if (CurrentOwnersArray.length < 1) {
                                            client.functions.AddModLog(client, msg.guild.id, msg.author.id, `<@${msg.author.id}> Claimed channel`, vc, '2')
                                            UpdateOwner(client, d, msg, fn, vc)

                                        } else {
                                            if (CurrentOwnersArray.includes(msg.author.id)) {
                                                client.functions.AddModLog(client, msg.guild.id, msg.author.id, `<@${msg.author.id}> Claimed channel`, vc, '2')
                                                removeCoOwnerfromCoOwnerList(d, msg.author.id, CurrentOwnersArray, vc.id);
                                                UpdateOwner(client, d, msg, fn, vc)
                                            } else {
                                                client.functions.Reply(msg, `Sorry, This channel has Co-Owners configured, Please ask one of them to claim the channel`)
                                            }
                                        }
                                    }
                                } else {
                                    client.functions.Reply(msg, `This channel is not claimable`)
                                }
                            }
                        })
                    } else {
                        client.functions.Reply(msg, `The channel you are currently in is not a temp channel`)
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
    cooldown: 10,
    maintenancemode: 0
}