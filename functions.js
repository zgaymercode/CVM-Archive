//#region INIT
const Discord = require("discord.js");
const { readdirSync } = require("fs");
const config = module.require("./config.js");
const mysql = require("mysql");
const SqlString = require("sqlstring");
const fs = require("fs");
const moment = require("moment");
//#endregion
//#region DATABASE
var con = mysql.createPool({
    connectionLimit: 10,
    host: config.db.host,
    user: config.db.user,
    password: config.db.pass,
    database: config.db.database,
});
//#endregion
//#region BOTSTUFF
var v = -1;
function consolelog(client, maxi) {
    v = v + 1;
    console.log(`Welcome to ` + client.user.username);
    console.log(" ");
    if (v < maxi) {
        console.log("intervals ran this session: " + v)
        console.log(" ");
    }
    
    if (v === maxi) {
        console.log("Maximum numbers of intervals per-session has been reached... Restarting and pulling from git repository to keep up to date");
        if (client.config.bot.isdevbuild === 1) {
            process.exit();
        } else {
            exec('git stash --include-untracked && git reset--hard && git clean - fd && git pull', (error, stdout, stderr) => {
                setTimeout(function () {
                    // I use pm2 to run my bot, so process.exit will essentially restart it
                    // a way around not using pm2 is create a shardman file and use that instead
                    process.exit();
                }, 100)
            })
        }                   
    }
}
function BotStatus(client) {
    // Random status' are fun arn't they? xD
    const activities_list = [
        'Multiple Voice chats at once. cvhelp for more info',
        'cvhelp for more info',
        'All the channels get created. cvhelp for more info',
    ];
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
    client.user.setActivity(activities_list[index], { type: "WATCHING" }); // sets bot's activities to one of the phrases in the arraylist.
}
//#endregion
//#region Cron Jobs
async function ChannelCleanup(client) {
    try{
        con.getConnection(function (err, d) {
            if (err) {
                console.error("error connecting: " + err.stack);
                return;
            }
            d.query('SELECT * FROM channels', async (er, re) => {
                if (er) console.error(er);
                if (re) {
                    for (let i = 0; i < re.length; i++) {
                        let id = re[i].id;
                        let vc = client.channels.cache.find(c => c.id === id);
                        // check if it exists
                        if (!vc) {
                            // Channel does not exist anymore, Yeet it from the db
                            let sqlGAYYY = SqlString.format(`DELETE FROM channels WHERE id=?`, [id]);
                            d.query(sqlGAYYY, async (err, res) => {
                                if (err) console.error(err);
                                if (!res) return;
                                if (res) console.log("Removed " + id + " from the DB");
                            })
                        } else {
                            /*
                                If there's any stale channels, we should take care of them as well
                                YEEET
                            */
                            if (vc.members.size < 1) {
                                vc.delete()
                                //yeet the info from the database
                                let sqlzor = SqlString.format('DELETE FROM channels WHERE id=?', [vc.id]);
                                d.query(sqlzor, async (er, res234) => {
                                    if (er) console.error(er);
                                    if (!res234) console.error("Could not delete entry");
                                    if (res234) console.log("Channel yeeted");
                                })
                            }
                        }
                    }
                }
                return;
            })
            d.release(function (err) {
                if (err) {
                    console.error(err);
                }
            });
        });
    }catch (e) {
        console.error(e);
    }
}
async function JoinchanCleanup(client) {
    con.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        d.query('SELECT * FROM joinchans', async (er, re) => {
            if (er) console.error(er);
            if (re) {
                for (let i = 0; i < re.length; i++) {
                    let id = re[i].joinchan;
                    if (!client.channels.cache.find(c => c.id === id)) {
                        // Channel does not exist anymore, Yeet it from the db
                        let sqlGAYYY = SqlString.format(`DELETE FROM joinchans WHERE joinchan=?`, [id]);
                        d.query(sqlGAYYY, async (err, res) => {
                            if (err) console.error(err);
                            if (!res) return;
                            if (res) console.log("Removed " + id + " from the DB");
                        })
                    }
                }
            }
            return;
        })
        d.release(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}
async function FilterListCleanup(client) {
    con.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        d.query('SELECT * FROM forbiddonwords', async (er, re) => {
            if (er) console.error(er);
            if (re) {
                for (let i = 0; i < re.length; i++) {
                    let id = re[i].gid;
                    if (id === 0) return; // return on the global filter lists
                    if (!client.guilds.cache.find(c => c.id === id)) {
                        // Bot is no longer in this server, and on leave, the bot didn't clear everything
                        // YEEEEEEEEEEEEEEEET :>
                        let sqlGAYYY = SqlString.format(`DELETE FROM forbiddonwords WHERE gid=?`, [id]);
                        d.query(sqlGAYYY, async (err, res) => {
                            if (err) console.error(err);
                            if (!res) return;
                            if (res) console.log("Removed " + id + " from the DB");
                        })
                    }
                }
            }
            return;
        })
        d.release(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}
//#endregion
//#region Utility Functions
async function Reply(msg, error) {
    let embed = new Discord.MessageEmbed()
        .setColor(config.embed.color)
        .setDescription(error);
    msg.channel.send(embed);
}
function timesince(timestamp) {
    var CurrentDate = moment();
    var startDate = moment(CurrentDate, 'YYYY-M-DD HH:mm:ss')
    var endDate = moment(timestamp, 'YYYY-M-DD HH:mm:ss')
    var minDiff = endDate.diff(startDate, 'minutes')

    return minDiff;
}
async function BlistedWordCheck(word, msg) {
    let gid = msg.guild.id;
    try {
        
        var sql = SqlString.format('SELECT * FROM forbiddonwords WHERE word=? AND gid=?', [word, gid]);
        con.getConnection(function (err, d) {
            if (err) {
                console.error("error connecting: " + err.stack);
                return;
            }
            d.query(sql, (er, re) => {
                if (re.length > 0) return true;
                return false;                
            })
            d.release(function (err) {
                if (err) {
                    console.error(err);
                }
            });
        });
    } catch (e) {
        console.error(e);
   }
}
async function serverDataCheck(client, guildID, callback) {
    
    client.database.getConnection(async (err, d) => {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        let sql = SqlString.format(`SELECT * FROM servers WHERE id=?`, [guildID]);
        d.query(sql, async (error, results) => {
            let prefix;
            let modlog;
            let adminlog;

            if (error) return console.error(error);
            if (results.length > 0) {
                client.config.tmp.var = [];
                prefix = results[0].prefix;
                modlog = results[0].modlog;
                adminlog = results[0].adminlog;
                if (prefix === null) prefix = client.config.bot.prefix;
            } else {
                prefix = client.config.bot.prefix;
                let sql2 = SqlString.format(`INSERT INTO servers SET id=?, prefix=?`, [guildID, prefix])
                d.query(sql2, (error2, result2) => {
                    if (error2) return console.error(error2);
                    if (result2) {
                        prefix = client.config.bot.prefix;
                        modlog = null;
                        adminlog = null;
                    }
                    
                })
            };
            callback({
                prefix, // Server's Prefix
                modlog, // Modlog channel ID
                adminlog, // Admin Log Channel ID
            })            
        })
        d.release(function (err) {
            
        });
    });
    
}
async function AddModLog(client, guildid, memberid, action, vc, type) {
    /*
        Type clearification:
        type = meaning
        0 = deleted
        1 = created
        2 = Channel edited
        3 = Permissions edited (ie: grant/deny/clear leader added/removed)
        
    */
    client.database.getConnection(async (connection_error, d) => {
        if (connection_error) return console.error(connection_error.stack);
        serverDataCheck(client, guildid, (serverdata) => {
            let modlog = serverdata.modlog;
            if (!modlog) return;
            let insertSql = SqlString.format(`INSERT INTO modlog SET guild_id=?, channel_id=?, member_id=?, action=?, type=?, timestamp=CURRENT_TIMESTAMP()`, [guildid, vc.id, memberid, action, type]);
            d.query(insertSql, (inserterror, results) => {
                if (inserterror) return console.error(inserterror);
                if (!results) return console.error(`Could not add ${action} to the modlog`);
                return;
            })
        })
        d.release(function (releaseerror) { if (releaseerror) console.error(releaseerror); });
    });
}
async function SendModLog(client, guildID, channelID) {
    console.log(`Channel Yeeted`);
    client.database.getConnection(async (connection_error, d) => {
        if (connection_error) return console.error(connection_error.stack);
        serverDataCheck(client, guildID, (serverdata) => {
            let modlog = serverdata.modlog;
            let logchannel = client.channels.cache.get(modlog);
            
            if (!modlog || !logchannel) return; // if the bot can't find the channel, or if it's not configured, stop here
            let findEntries = SqlString.format(`SELECT * FROM modlog WHERE channel_id=?`, [channelID]);
            d.query(findEntries, (error, results) => {
                if (error) return console.error(error);
                let resultl = results.length;
                if (!resultl) return console.error(`No results found for ${channelID}`);

                // form the embed
                embed = new Discord.MessageEmbed()
                    .setColor(client.config.embed.color)
                    .setAuthor(`${client.user.username} Channel Log`, '', client.config.bot.giturl)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setFooter(`${client.config.embed.footer} | ${client.config.embed.ver}`, client.user.avatarURL({ dynamic: true }));
                if (client.config.bot.isdevbuild === 1) {
                    embed.setDescription("Warning: Times are actually UTC, they are showing Central due to the bot being ran on my local machine, all times are updated and created using the server, and the code doesn't know that ;3")
                }
                // form the query for searching for types of logs
                let findtype0 = SqlString.format(`SELECT * FROM modlog WHERE channel_id=? AND type='0' ORDER BY timestamp desc`, [channelID]);
                let findtype1 = SqlString.format(`SELECT * FROM modlog WHERE channel_id=? AND type='1' ORDER BY timestamp desc`, [channelID]);
                let findtype2 = SqlString.format(`SELECT * FROM modlog WHERE channel_id=? AND type='2' ORDER BY timestamp desc`, [channelID]);
                let findtype3 = SqlString.format(`SELECT * FROM modlog WHERE channel_id=? AND type='3' ORDER BY timestamp desc`, [channelID]);
                // get type 1 data (refer to AddModLog() for type clearifications)
                d.query(findtype1, (findtype1error, findtype1results) => {
                    if (findtype1error) return console.error(findtype1error)
                    let type1resultslength = findtype1results.length;
                    if (type1resultslength < 1) return;
                    
                    let timestamp = findtype1results[0].timestamp;
                    let action = findtype1results[0].action;
                    let last_owner = findtype1results[0].member_id;
                    embed.addField(`Owner:`, `<@${last_owner}>`)
                    embed.addField(`${action}`, `${timestamp}`)
                    d.query(findtype2, (findtype2error, findtype2results) => {
                        if (findtype2error) return console.error(findtype2error)
                        let type2resultslength = findtype2results.length;
                        
                        if (type2resultslength > 0) {
                            actionArray = [];
                            for (let i2 = 0; i2 < type2resultslength; i2++) {
                                let action = findtype2results[i2].action;
                                let timestamp = findtype2results[i2].timestamp;
                                actionArray.push(`${timestamp}: ${action} \n`);
                            }
                            if (actionArray.length > 0) embed.addField(`Actions:`, `${actionArray}`);
                        }                        
                        d.query(findtype3, (findtype3error, findtype3results) => {
                            if (findtype3error) return console.error(findtype3error)
                            let type3resultslength = findtype3results.length;
                            if (type3resultslength < 1) {
                                PermsactionArray = [];
                                for (let i3 = 0; i3 < type3resultslength; i3++) {
                                    let action = findtype3results[i3].action;
                                    let timestamp = findtype2results[i3].timestamp;
                                    PermsactionArray.push(`${timestamp}: ${action} \n`);
                                }
                                if (PermsactionArray.length > 0) embed.addField(`Actions:`, `${PermsactionArray}.`);
                            }
                            d.query(findtype0, (findtype0error, findtype0results) => {
                                if (findtype0error) return console.error(findtype0error)
                                let type0resultslength = findtype0results.length;
                                if (type0resultslength < 1) return logchannel.send(embed);;
                                let action = findtype0results[0].action;
                                
                                let timestamp = findtype0results[0].timestamp;
                                embed.addField(`${action}`, `${timestamp}`);
                                logchannel.send(embed);
                            })

                        })
                    })
                })
            });
        })
        d.release(function (releaseerror) { if (releaseerror) console.error(releaseerror); });
    });
}
//#endregion
module.exports = {
    consolelog,
    AddModLog,
    BotStatus,
    Reply,
    ChannelCleanup,
    JoinchanCleanup,
    timesince,
    FilterListCleanup,
    BlistedWordCheck,
    SendModLog,
    serverDataCheck
}