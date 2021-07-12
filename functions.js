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
        process.exit();
    }
}
function BotStatus(client) {
    // Random status' are fun arn't they? xD
    const activities_list = [
        'Multiple Voice chats at once. cvhelp for more info',
        'cvhelp for more info',
        'All the channels get created. cvhelp for more info',
        '@me for my current prefix in your server!'
    ];
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
    client.user.setActivity(activities_list[index], { type: "WATCHING" }); // sets bot's activities to one of the phrases in the arraylist.
}
async function intervals(client) {
    m = 50; // max intervals before restart
    client.user.setActivity(client.config.bot.startstatus, { type: "PLAYING" });
    consolelog(client, m);
    ChannelCleanup(client);
    QCleanup(client);
    JoinchanCleanup(client);
    FilterListCleanup(client);
    setInterval(() => {
        BotStatus(client);
        ChannelCleanup(client);
        QCleanup(client);
        JoinchanCleanup(client);
        FilterListCleanup(client);
        consolelog(client, m);
    }, 150000); // every 2.5 minutes
}
//#endregion
//#region Cron Jobs
async function QCleanup(client) {
    client.database.getConnection(function (error, d) {
        if (error) console.error(`error Connecting to db: ${error.stack}`);
        d.query(`SELECT * FROM queue`, (error, results) => {
            if (error) console.error(error);
            if (results.length < 1) return;
            for (let i = 0; i < results.length; i++) {
                let created = results[i].created;
                let time = timesince(created);
                if (time >= 90) {
                    let query = SqlString.format(`DELETE FROM queue WHERE created=?`, [created]);
                    d.query(query, (erro, resul) => {
                        if (erro) console.error(erro);
                        if (resul) return;
                    })
                }
            }
        })
        d.release(function (error) { if (er) console.error(er) });
    })
}
async function ChannelCleanup(client) {
    try {
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
    } catch (e) {
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
    // helper function to check difference in time (used in rename command)
    var CurrentDate = moment();
    var startDate = moment(CurrentDate, 'YYYY-M-DD HH:mm:ss')
    var endDate = moment(timestamp, 'YYYY-M-DD HH:mm:ss')
    var minDiff = endDate.diff(startDate, 'minutes')

    if (minDiff < 0) {
        minDiff = minDiff * -1;
    }
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
            let prefix; // Server's Prefix
            let modlog; // Modlog channel ID
            let adminlog; // Admin Log Channel ID
            let premiumBlessed;
            // Command Perms
            let owner;
            let lock;
            let unlock;
            let partyremove;
            let partyclear;
            let partyadd;
            let limit;
            let invite;
            let coowner;
            let transfer;
            let kick;
            let rename;
            let queue;
            let claim;
            let hand;

            if (error) return console.error(error);
            if (results.length > 0) {
                client.config.tmp.var = [];
                prefix = results[0].prefix;
                modlog = results[0].modlog;
                adminlog = results[0].adminlog;
                premiumBlessed = results[0].premium_blessed;

                // Command Perms
                owner = results[0].owner;
                lock = results[0].lock;
                unlock = results[0].unlock;
                partyremove = results[0].partyremove;
                partyclear = results[0].partyclear;
                partyadd = results[0].partyadd;
                limit = results[0].limit;
                invite = results[0].invite;
                coowner = results[0].coowner;
                transfer = results[0].transfer;
                kick = results[0].kick;
                rename = results[0].rename;
                queue = results[0].queue;
                claim = results[0].claim;
                hand = results[0].hand;
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
                        premiumBlessed = 0;

                        // Command Perms
                        owner = 1,
                            lock = 1;
                        unlock = 1;
                        partyremove = 1;
                        partyclear = 1;
                        partyadd = 1;
                        limit = 1;
                        invite = 1;
                        coowner = 1;
                        transfer = 1;
                        kick = 1;
                        rename = 1;
                        queue = 1;
                        claim = 1;
                        hand = 1;
                    }

                })
            };
            callback({
                prefix, // Server's Prefix
                modlog, // Modlog channel ID
                adminlog, // Admin Log Channel ID
                premiumBlessed, // Whether the server has access to premium features

                // Server Wide Command Perms
                owner,
                lock,
                unlock,
                partyremove,
                partyclear,
                partyadd,
                limit,
                invite,
                coowner,
                transfer,
                kick,
                rename,
                queue,
                claim,
                hand
            })
        })
        d.release(function (err) { });
    });

}
async function AddAdminLog(client, guildid, memberid, action) {
    /*
        this script executes anytime an administrative command
        is ran, it first checks if admin logs are enabled, and 
        if not, it looks for mod logs
        assuming admin logs are enabled, 
        the script sends a brief log of who sent what command into
        the admin log of the server
    */
    serverDataCheck(client, guildid, (serverdata) => {
        let adminlog = serverdata.adminlog;
        let modlog = serverdata.modlog;
        if (adminlog === null) log = modlog;
        if (adminlog != null) log = adminlog;
        if (log === null) return;
        embed = new Discord.MessageEmbed()
            .setColor(client.config.embed.color)
            .setAuthor(`${client.user.username} Admin Log`, '', client.config.bot.giturl)
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setTimestamp()
            .addField(`Member`, `<@${memberid}>`)
            .addField(`Action`, `${action}`)
            .setFooter(`${client.config.embed.footer} | ${client.config.embed.ver}`, client.user.avatarURL({ dynamic: true }));
        try {
            client.channels.cache.get(log).send(embed);
        } catch (e) {
            console.log(e)
        }


    })
}
async function AddModLog(client, guildid, memberid, action, vc, type) {
    /*
        Type clearification:
        type = meaning
        0 = deleted
        1 = created
        2 = Channel edited
        3 = Permissions edited (ie: grant/deny/clear leader added/removed)

        this script is called upon anytime a channel's state is changed in any way
        ie: renamed, limit changed, owner changed, someone's granted, deleted, created etc.. 

        what this script will do is 1st check to see if modlog is defined in the serverDataCheck
        if it's not, the bot acts as that is the feature being disabled and doesn't continue
        assuming that's good, it will take the guildid, executing member's id, action (defined in the individual
        command files), the vc object (for manipulation here) and the type. 
        it will insert all of this data into the database, and return errors if any occur, otherwise
        it silently returns

        
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
    /*
        This function is called on the deletion of a tmp voice channel
        how it works: 
        first, we create a database connection looking for everything in modlogs where 
        the channel id's match the given channel id
        this allows us to filter out bad calls before getting into the nitty gritty, 
        
        if results were found, it goes into creating an embed and defining the sql queries
        for the next few runs
        the 1st sql query, looks for when the channel was created (using type 1)
        the 2nd sql query, looks for any records of the channel being edited (ie: renames, limit changes, lock/unlocks)
        the 3rd sql query, looks for permission edits (ie: grant/deny/clear leader added/removed ect)
        the 4th and final query, looks for the channel deletion record, if this hasn't happened yet, it just sends the log
        
        the sending of the log after delete is in anticipation of new code when it's implemented
        Plan is to send a mod log on owner change, then this function will be refined to search for channel_id & owner ID pairs

        once it has all the data it needs to send the log, 
        it sends it into the mod log defined by the serverDataCheck(), if the data check didn't bring back a modlog id, 
        or if it can't find the modlog id using the client.channels.cache object, 
        The script will not make it the execution of the 1st query
   */
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
                    let formattedTimestamp1 = moment(timestamp).format("MM-D-YY h:mm:ss a UTC")
                    let action = findtype1results[0].action;
                    let last_owner = findtype1results[0].member_id;
                    embed.addField(`Creator:`, `<@${last_owner}>`)
                    embed.addField(`${action}`, `${formattedTimestamp1}`)
                    d.query(findtype2, (findtype2error, findtype2results) => {
                        if (findtype2error) return console.error(findtype2error)
                        let type2resultslength = findtype2results.length;

                        if (type2resultslength > 0) {
                            actionArray = [];
                            for (let i2 = 0; i2 < type2resultslength; i2++) {
                                let action = findtype2results[i2].action;
                                let timestamp = findtype2results[i2].timestamp;
                                let formattedTimestamp2 = moment(timestamp).format("MM-D-YY h:mm:ss a UTC")
                                actionArray.push(`${formattedTimestamp2} : ${action} \n`);
                            }
                            let formattedactionArray = actionArray.join(" ").replace(/,/g, '\n');
                            if (!formattedactionArray) FormattedPermsactionArray = "None Found";
                            embed.addField(`Channel Actions:`, `${formattedactionArray}`);
                        }
                        d.query(findtype3, (findtype3error, findtype3results) => {
                            if (findtype3error) return console.error(findtype3error)
                            let type3resultslength = findtype3results.length;
                            if (type3resultslength < 1) {
                                PermsactionArray = [];
                                for (let i3 = 0; i3 < type3resultslength; i3++) {
                                    let action = findtype3results[i3].action;
                                    let timestamp = findtype2results[i3].timestamp;
                                    let formattedTimestamp3 = moment(timestamp).format("MM-D-YY h:mm:ss a UTC")
                                    PermsactionArray.push(`${formattedTimestamp3}: ${action}`);
                                }
                                let FormattedPermsactionArray = PermsactionArray.join(" ").replace(/,/g, '\n');
                                if (!FormattedPermsactionArray) FormattedPermsactionArray = "None Found";
                                embed.addField(`Permission Actions:`, `${FormattedPermsactionArray}`);
                            }
                            d.query(findtype0, (findtype0error, findtype0results) => {
                                if (findtype0error) return console.error(findtype0error)
                                if (findtype0results.length < 1) logchannel.send(embed)
                                let action = findtype0results[0].action;

                                let timestamp = findtype0results[0].timestamp;
                                let formattedTimestamp4 = moment(timestamp).format("MM-D-YY, h:mm:ss a UTC")
                                embed.addField(`${action}`, `${formattedTimestamp4}`);
                                try {
                                    logchannel.send(embed);
                                } catch (e) {
                                    console.log(e)
                                }
                            })

                        })
                    })
                })
            });
        })
        d.release(function (releaseerror) { if (releaseerror) console.error(releaseerror); });
    });
}
async function vcPermsCheck(client, msg, callback) {
    /*
        this checks to see if the member is either a leader or a owner of their current channel
        it sends a call back as a js object, but pulls a json object from the db
        
        script: connects to db, grabs the coowner column, and return it, formats as json, and for loop on it
        until it finds the msg.author.id, once it does, it ends the loop, and sends a callback of the user's access
        level
    */
    client.database.getConnection(async (connection_error, d) => {
        if (connection_error) return console.error(connection_error.stack);
        let vcid = msg.member.voice.channel.id;
        let insertSql = SqlString.format(`SELECT * FROM channels WHERE id=?`, [vcid]);
        d.query(insertSql, (inserterror, results) => {
            if (inserterror) return console.error(inserterror);
            if (results.length < 1) return Reply(msg, `There was an error in the matrix, couldn't find current voice channel in my database ;3`);
            let VCOwnerID = results[0].oid;
            let retrieveCoOwnersObj = results[0].coowner;
            let jsonObjectFromDB = JSON.parse(retrieveCoOwnersObj)
            let CurrentOwnersArray = jsonObjectFromDB.coowners || [];
            ModPermsCheck(msg, (modcheck) => {
                if (modcheck && msg.author.id != VCOwnerID && !CurrentOwnersArray.includes(msg.author.id)) {
                    callback({
                        auth: 1,
                        modlog: 1
                    });
                } else if (msg.author.id === VCOwnerID || CurrentOwnersArray.includes(msg.author.id) || modcheck) {
                    callback({
                        auth: 1,
                        modlog: 0
                    });
                } else {
                    if (CurrentOwnersArray.includes(msg.author.id)) {
                        callback({
                            auth: 1,
                            modlog: 0
                        });
                    } else if (VCOwnerID === msg.author.id) {
                        callback({
                            auth: 1,
                            modlog: 0
                        });
                    } else {
                        callback({
                            auth: 0,
                            modlog: 0
                        });
                    }
                }
            })
        })
        d.release(function (releaseerror) { if (releaseerror) console.error(releaseerror); });
    });
}
async function ModPermsCheck(msg, callback) {
    if (
        msg.member.hasPermission("MOVE_MEMBERS") ||
        msg.member.hasPermission("MANAGE_GUILD") ||
        msg.member.hasPermission("ADMINISTRATOR")
    ) {
        callback(true)
    } else {
        callback(false)
    }
}
async function isActivityVC(client, msg, callback) {
    let vcid = msg.member.voice.channel.id;
    var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [vcid]);
    client.database.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        d.query(sql, async (er, re) => {
            if (er) console.error(er);
            if (!re) return;
            if (re.length > 0) {
                let activity = re[0].is_stage;
                if (activity === 1) {
                    callback(true);
                } else {
                    Reply(msg, `This is an activity voice feature. The channel you are currently in is not an activity channel`);
                    callback(false);
                }
            }
        })
        d.release(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}
async function isTmpVC(client, msg, callback) {
    if (!msg.member.voice.channel) {
        callback(false);
        return;
    }
    let vcid = msg.member.voice.channel.id;
    var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [vcid]);
    client.database.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        d.query(sql, async (er, re) => {
            if (er) console.error(er);
            if (!re) return;
            if (re.length > 0) {
                callback(true);
            } else {
                Reply(msg, `Sorry, You must be in a temporary channel to use this command`);
                callback(false);
            }
        })
        d.release(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}
async function DeleteFromQueue(client, id) {
    client.database.getConnection(async (connection_error, d) => {
        if (connection_error) return console.error(connection_error.stack);
        let insertSql = SqlString.format(`DELETE FROM queue WHERE userid=?`, [id]);
        d.query(insertSql, (inserterror, results) => {
            if (inserterror) return console.error(inserterror);
            if (results.length < 1) return false;
            return true;
        })
        d.release(function (releaseerror) { if (releaseerror) console.error(releaseerror); });
    });
}
async function premiumChannelPermChecks(client, msg, callback) {
    let owner, lock, unlock, partyremove, partyclear, partyadd, limit, invite, coowner, transfer, kick, rename, queue, claim, hand;

    serverDataCheck(client, msg.guild.id, (server) => {
        if (server.premiumBlessed == 0) {
            console.log(`Not a premium server ${msg.guild.id} ${server.premiumBlessed}`);
            // Command Perms
            owner = 1;
            lock = 1;
            unlock = 1;
            partyremove = 1;
            partyclear = 1;
            partyadd = 1;
            limit = 1;
            invite = 1;
            coowner = 1;
            transfer = 1;
            kick = 1;
            rename = 1;
            queue = 1;
            claim = 1;
            hand = 1;
            return callback({
                // Command Perms
                owner,
                lock,
                unlock,
                partyremove,
                partyclear,
                partyadd,
                limit,
                invite,
                coowner,
                transfer,
                kick,
                rename,
                queue,
                claim,
                hand
            })
        } else {
            client.database.getConnection(function (err, d) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                if (!msg.member.voice.channel) {
                    owner = 1;
                    lock = 1;
                    unlock = 1;
                    partyremove = 1;
                    partyclear = 1;
                    partyadd = 1;
                    limit = 1;
                    invite = 1;
                    coowner = 1;
                    transfer = 1;
                    kick = 1;
                    rename = 1;
                    queue = 1;
                    claim = 1;
                    hand = 1;
                    return callback({
                        // Command Perms
                        owner,
                        lock,
                        unlock,
                        partyremove,
                        partyclear,
                        partyadd,
                        limit,
                        invite,
                        coowner,
                        transfer,
                        kick,
                        rename,
                        queue,
                        claim,
                        hand
                    })
                }
                let vcid = msg.member.voice.channel.id;
                var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [vcid]);
                d.query(sql, async (er, re) => {
                    if (er) console.error(er);
                    if (re.length < 1) {
                        owner = 1;
                        lock = 1;
                        unlock = 1;
                        partyremove = 1;
                        partyclear = 1;
                        partyadd = 1;
                        limit = 1;
                        invite = 1;
                        coowner = 1;
                        transfer = 1;
                        kick = 1;
                        rename = 1;
                        queue = 1;
                        claim = 1;
                        hand = 1;
                        return callback({
                            // Command Perms
                            owner,
                            lock,
                            unlock,
                            partyremove,
                            partyclear,
                            partyadd,
                            limit,
                            invite,
                            coowner,
                            transfer,
                            kick,
                            rename,
                            queue,
                            claim,
                            hand
                        })
                    }
                    let joinchan = re[0].joinchan;
                    let sqlcheckJoinChan = SqlString.format(`SELECT * FROM joinchans WHERE joinchan=?`, [joinchan]);
                    d.query(sqlcheckJoinChan, (errorjoincheck, resultsjoincheck) => {
                        if (errorjoincheck) console.error(errorjoincheck);

                        // Command Perms
                        owner = resultsjoincheck[0].owner;
                        lock = resultsjoincheck[0].lock;
                        unlock = resultsjoincheck[0].unlock;
                        partyremove = resultsjoincheck[0].partyremove;
                        partyclear = resultsjoincheck[0].partyclear;
                        partyadd = resultsjoincheck[0].partyadd;
                        limit = resultsjoincheck[0].limit;
                        invite = resultsjoincheck[0].invite;
                        coowner = resultsjoincheck[0].coowner;
                        transfer = resultsjoincheck[0].transfer;
                        kick = resultsjoincheck[0].kick;
                        rename = resultsjoincheck[0].rename;
                        queue = resultsjoincheck[0].queue;
                        claim = resultsjoincheck[0].claim;
                        hand = resultsjoincheck[0].hand;


                        return callback({
                            // Command Perms
                            owner,
                            lock,
                            unlock,
                            partyremove,
                            partyclear,
                            partyadd,
                            limit,
                            invite,
                            coowner,
                            transfer,
                            kick,
                            rename,
                            queue,
                            claim,
                            hand
                        })
                    })

                })
                d.release(function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            });
        }
    })
}
//#endregion
module.exports = {
    AddAdminLog,
    AddModLog,
    BlistedWordCheck,
    DeleteFromQueue,
    intervals,
    isActivityVC,
    isTmpVC,
    ModPermsCheck,
    ChannelCleanup,
    JoinchanCleanup,
    premiumChannelPermChecks,
    Reply,
    SendModLog,
    serverDataCheck,
    timesince,
    vcPermsCheck,
}
