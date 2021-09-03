const SqlString = module.require('sqlstring');
function RemoveCoOwner(client, msg, d, id, vcid, CurrentOwnersArray) {
    ArrayofModifiedCoOwners = [];
    for (let i = 0; i < CurrentOwnersArray.length; i++) {
        if (CurrentOwnersArray[i] === id) continue;
        ArrayofModifiedCoOwners.push(`"${CurrentOwnersArray[i]}"`);
    }
    let NewDBOwnerObject = `{"coowners": [${ArrayofModifiedCoOwners}]}`
    let sql = SqlString.format(`UPDATE channels SET coowner=? where id=?`, [NewDBOwnerObject, vcid])
    d.query(sql, (error, results) => {
        if (error || results.length < 1) return client.functions.Reply(msg, `There was an error updating the channel`);
        client.functions.Reply(msg, `Channel's Co-Owner list has successfully been updated.`)
    })
}
function ChownR(client, msg, d, newownerid, vc) {
    let newOwnerSQL = SqlString.format(`UPDATE channels SET oid=? WHERE id=?`, [newownerid, vc.id]);
    d.query(newOwnerSQL, (newOwnerSQL_error, newOwnerSQL_results) => {
        if (newOwnerSQL_error) console.error(newOwnerSQL_error);
        if (newOwnerSQL_results.length < 1) return;
        if (msg.needsAdminLog === 1) {
            client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `Transfered ownership of ${vc.id} to <@${newownerid}>`);
        }
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
                        let step2 = step1.replace(/%INC%/g, inc);
                        template = step2.replace(/%NICKNAME%/g, displayname)
                        if (prefix === null) prefix = '';
                        VoiceChannelName = `${prefix} ${template}`;
                        vc.setName(`${VoiceChannelName}`, `Channel Claimed by: ${msg.author.username}`);

                    }

                })
            })
        }
        client.functions.Reply(msg, `Ownership has been transfered to <@${newownerid}>`)
    })
}
module.exports.run = async (client, msg, args) => {
    client.database.getConnection(function (error, d) {
        if (error) console.error(`error Connecting to db: ${error.stack}`);
        let vcid = msg.member.voice.channel.id;
        let DBChanneldata = SqlString.format(`SELECT * FROM channels WHERE id=?`, [vcid]);

        d.query(DBChanneldata, (DBChanneldata_error, DBChanneldata_result) => {
            if (DBChanneldata_error) console.error(DBChanneldata_error);
            if (DBChanneldata_result.length < 1) return client.functions.Reply(msg, `There was a problem finding the config for this channel`);

            let oid = DBChanneldata_result[0].oid;
            let retrieveCoOwnersObj = DBChanneldata_result[0].coowner;
            let jsonObjectFromDB = JSON.parse(retrieveCoOwnersObj)
            let CurrentOwnersArray = jsonObjectFromDB.coowners || [];
            if (!msg.mentions.members.first()) return client.functions.Reply(msg, "You must @mention a member to transfer this channel to");
            let newownerid = msg.mentions.members.first().id;
            let invc;
            msg.member.voice.channel.members.each((member) => {
                if (member.id != newownerid) return
                invc = 1;
            })
            if (invc != 1) return client.functions.Reply(msg, `<@${newownerid}> is not in the channel with you`)
            if (CurrentOwnersArray.includes(newownerid)) {
                RemoveCoOwner(client, msg, d, newownerid, vcid, CurrentOwnersArray)
            }
            client.functions.ModPermsCheck(msg, (response) => {
                if (!response) {
                    if (msg.author.id === oid) {
                        ChownR(client, msg, d, newownerid, msg.member.voice.channel)
                    } else {
                        client.functions.Reply(msg, client.config.messages.notowner)
                    }
                } else {
                    ChownR(client, msg, d, newownerid, msg.member.voice.channel)
                }
            })

        })
        d.release(function (error) { if (er) console.error(er) });
    })
}
module.exports.help = {
    name: "transfer",
    //aliases: [""],
    description: "transfers ownership to the @mentioned user",
    usage: "transfer @member",
    category: "VC Owner Command",
    cooldown: 0,
    maintenancemode: 0
}