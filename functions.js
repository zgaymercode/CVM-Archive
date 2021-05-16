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
    guildcount = client.guilds.cache.size;
    usercache = client.users.cache.size;
    channelcache = client.channels.cache.size;
    console.log(`Welcome to ` + client.user.username);
    console.log(" ");
    if (v < maxi) {
        console.log("intervals ran this session: " + v)
        console.log(" ");
    }
    if (v === maxi) {
        console.log("Maximum numbers of intervals per-session has been reached... Restarting");
        setTimeout(() => {
            process.exit(); // restart electroheart <3
        }, 500);
    }
}
function BotStatus(client) {
    const activities_list = [
        "the world go by..",
        "all the timezones",
        "the spin go world round <3",
        "you sleep o_O",
        "Cowboys do the river dance"
    ];
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
    client.user.setActivity(activities_list[index], { type: "WATCHING" }); // sets bot's activities to one of the phrases in the arraylist.
}
//#endregion
async function Reply(msg, error) {
    let embed = new Discord.MessageEmbed()
        .setColor(config.embed.color)
        .setDescription(error);
    msg.channel.send(embed).then((m) => {
        setTimeout(() => {
            m.delete();
        }, 5000);
    })
}
async function vcOwnerCheck(vcid, uid, msg) {
    var sql = SqlString.format('SELECT * FROM channels WHERE id=? AND oid=?', [vcid, uid]);
    con.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        d.query(sql, async (er, re) => {
            if (er) console.error(er);
            if (!re) {
                if (msg.member.hasPermission("MOVE_MEMBERS") || msg.member.hasPermission("ADMINISTRATOR")) {
                    return true;
                } else {
                    return false;
                }
            }
            if (re) {
                return true;
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
}
async function ChannelCleanup(client) {
    con.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        d.query('SELECT * FROM channels', async (er, re) => {
            if (er) console.error(er);
            if (!re) return;
            if (re) {
                
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
}
module.exports = {
    consolelog,
    BotStatus,
    Reply,
    vcOwnerCheck,
}