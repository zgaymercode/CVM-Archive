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
        console.log("Maximum numbers of intervals per-session has been reached... Restarting");
        setTimeout(() => {
            // I use pm2 to run my bot, so process.exit will essentially restart it
            // a way around not using pm2 is create a shardman file and use that instead
            process.exit(); // restart electroheart <3
        }, 500);
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
//#endregion
module.exports = {
    consolelog,
    BotStatus,
    Reply,
    ChannelCleanup,
    JoinchanCleanup,
    timesince,
    FilterListCleanup,
    BlistedWordCheck,
}