const SqlString = module.require('sqlstring')
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    try {
        if (msg.member.voice.channel) {
            let vcid = msg.member.voice.channel.id;
            var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [vcid]);
            con.getConnection(function (err, d) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                d.query(sql, async (er, re) => {
                    if (er) console.error(er);
                    if (!re) return;
                    if (re.length > 0) {
                        let ownerid = re[0].oid;
                        let ownerleavetimestamp = re[0].ownerleavetimestamp || false;
                        let retrieveCoOwnersObj = re[0].coowner;
                        let jsonObjectFromDB = JSON.parse(retrieveCoOwnersObj)
                        let CurrentOwnersArray = jsonObjectFromDB.coowners || [];

                        let timesinceleave = client.functions.timesince(ownerleavetimestamp);
                        let cooldown = config.bot.ownerleavecooldown;
                        let timeleftuntilclaimable = cooldown - timesinceleave;
                        if (timeleftuntilclaimable < 0) {
                            timeleftuntilclaimable = timeleftuntilclaimable * -1;
                        }
                        ClaimableStatus = ''
                        if (ownerleavetimestamp) {
                            if (timeleftuntilclaimable > cooldown) {
                                ClaimableStatus = '\n **Claim Status**:\n Claimable';
                            } else {
                                ClaimableStatus = `\n **Claim Status**:\n ${timeleftuntilclaimable} Minutes Left until claimable`;
                            }
                        }
                        ArrayofCoOwnerTags = [];
                        for (let i = 0; i < CurrentOwnersArray.length; i++) {
                            ArrayofCoOwnerTags.push(`<@${CurrentOwnersArray[i]}>`);
                        }
                        let CoOwnerTags = ArrayofCoOwnerTags.toString().replace(/,/g, ' \n')
                        if (CoOwnerTags.length < 1) {
                            client.functions.Reply(msg, `**Current Owner**: <@${ownerid}> ${ClaimableStatus}`)
                        } else {
                            client.functions.Reply(msg, `**Current Owner**: <@${ownerid}> \n \n**Current Co-Owners:**\n ${CoOwnerTags} ${ClaimableStatus}`)
                        }


                    } else {
                        client.functions.Reply(msg, `The channel you're currently in is not a temporary channel`)
                    }
                })
                d.release(function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            });

        } else {

            client.functions.ModPermsCheck(msg, async (modperms) => {
                if (!modperms) return client.functions.Reply(msg, config.messages.notinvoice);
                let vcid = args[0]; // We need to clean the inputs up now :3
                let notValidIDSyntax = `Please input a valid channel id`;
                // verify numbers were inputed, and nothing else
                if (!isNaN(vcid)) {
                    let vc = await msg.guild.channels.cache.get(vcid);
                    // verify the channel is a real channel in the server ;3
                    if (!vc) {
                        client.functions.Reply(msg, notValidIDSyntax);
                    } else {
                        var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [vc.id]);
                        con.getConnection(function (err, d) {
                            if (err) {
                                console.error("error connecting: " + err.stack);
                                return;
                            }
                            d.query(sql, async (er, re) => {
                                if (er) console.error(er);
                                if (!re) return client.functions.Reply(msg, `That channel does not seem to be a temporary channel`);
                                if (re.length > 0) {
                                    let ownerid = re[0].oid;
                                    let ownerleavetimestamp = re[0].ownerleavetimestamp || false;
                                    let retrieveCoOwnersObj = re[0].coowner;
                                    let jsonObjectFromDB = JSON.parse(retrieveCoOwnersObj)
                                    let CurrentOwnersArray = jsonObjectFromDB.coowners || [];

                                    let timesinceleave = client.functions.timesince(ownerleavetimestamp);
                                    let cooldown = config.bot.ownerleavecooldown;
                                    let timeleftuntilclaimable = cooldown - timesinceleave;
                                    if (timeleftuntilclaimable < 0) {
                                        timeleftuntilclaimable = timeleftuntilclaimable * -1;
                                    }
                                    ClaimableStatus = ''
                                    if (ownerleavetimestamp) {
                                        if (timeleftuntilclaimable > cooldown) {
                                            ClaimableStatus = '\n **Claim Status**:\n Claimable';
                                        } else {
                                            ClaimableStatus = `\n **Claim Status**:\n ${timeleftuntilclaimable} Minutes Left until claimable`;
                                        }
                                    }
                                    ArrayofCoOwnerTags = [];
                                    for (let i = 0; i < CurrentOwnersArray.length; i++) {
                                        ArrayofCoOwnerTags.push(`<@${CurrentOwnersArray[i]}>`);
                                    }
                                    let CoOwnerTags = ArrayofCoOwnerTags.toString().replace(/,/g, ' \n')
                                    if (CoOwnerTags.length < 1) {
                                        client.functions.Reply(msg, `**Current Owner**: <@${ownerid}> ${ClaimableStatus}`)
                                    } else {
                                        client.functions.Reply(msg, `**Current Owner**: <@${ownerid}> \n \n**Current Co-Owners:**\n ${CoOwnerTags} ${ClaimableStatus}`)
                                    }


                                } else {
                                    client.functions.Reply(msg, `The channel you're currently in is not a temporary channel`)
                                }
                            })
                            d.release(function (err) {
                                if (err) {
                                    console.error(err);
                                }
                            });
                        });
                    }
                } else {
                    client.functions.Reply(msg, notValidIDSyntax);
                }
            })
        }

    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "owner",
    //aliases: [""],
    description: "Shows who the current Owner and Co-Owners are. Mods can affix <channel_id> to the end of the command and see this info as well",
    usage: "owner {channel_id}",
    category: "General",
    cooldown: 0,
    maintenancemode: 0
}