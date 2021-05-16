//#region init
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');
const { sep } = require('path');
const mysql = require("mysql");
const { readdirSync } = require("fs");
const SqlString = require("sqlstring");
const fn = require('./functions.js');
["commands", "aliases"].forEach((x) => (client[x] = new Discord.Collection()));
//#endregion
//#region LOAD ALL COMMANDS
const load = (dir = "./commands/") => {
    readdirSync(dir).forEach((dirs) => {
        // we read the commands directory for sub folders and filter the files with name with extension .js
        const commands = readdirSync(`${dir}${sep}${dirs}${sep}`).filter((files) =>
            files.endsWith(".js")
        );

        // we use for loop in order to get all the commands in sub directory
        for (const file of commands) {
            // We make a pull to that file so we can add it the client.commands collection
            const pull = require(`${dir}/${dirs}/${file}`);
            // we check here if the command name or command category is a string or not or check if they exist
            if (
                pull.help &&
                typeof pull.help.name === "string" &&
                typeof pull.help.category === "string"
            ) {
                if (client.commands.get(pull.help.name))
                    return console.warn(
                        `Two or more commands have the same name ${pull.help.name}.`
                    );
                // we add the the comamnd to the collection, Map.prototype.set() for more info
                client.commands.set(pull.help.name, pull);
                // we log if the command was loaded.
                //console.log(`${success} Loaded command ${pull.help.name}.`);
            } else {
                // we check if the command is loaded else throw a error saying there was command it didn't load
                console.log(
                    `Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`
                );
                // we use continue to load other commands or else it will stop here
                continue;
            }
            // we check if the command has aliases, is so we add it to the collection
            if (pull.help.aliases && typeof pull.help.aliases === "object") {
                pull.help.aliases.forEach((alias) => {
                    // we check if there is a conflict with any other aliases which have same name
                    if (client.aliases.get(alias))
                        return console.warn(
                            `Two commands or more commands have the same aliases ${alias}`
                        );
                    client.aliases.set(alias, pull.help.name);
                });
            }
        }
    });
};
load();
//#endregion
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
client.on("ready", () => {
    m = 15; // max intervals before restart
    client.user.setActivity(config.bot.startstatus, { type: "PLAYING" });
    fn.consolelog(client, m);
    setInterval(() => {
        //fn.BotStatus(client);
        fn.consolelog(client, m);
    }, 300000); // every 5 minutes
});
client.on("message", async (msg) => {    // check if msg author is a bot or if the message is in a guild
    if (msg.author.bot) return;
    if (!msg.guild) return;
    // handle the command arguments and schtuffs
    let prefix = config.bot.prefix;
    if (!msg.content.startsWith(prefix)) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    let command;

    if (!msg.member) msg.member = msg.guild.fetchMember(msg.author);
    if (cmd.length === 0) return;
    if (client.commands.has(cmd)) command = client.commands.get(cmd); 
    else if (client.aliases.has(cmd)) command = client.commands.get(client.aliases.get(cmd));
    if (!command) return;
    // handle the command
    
    if (config.bot.cmds_enabled == 0) {
        // user needs to be a part of bot staff for commands to run
        if (config.staff.includes(msg.author.id)) {
            command.run(client, con, config, msg, args, fn)
        } else {
            fn.Reply(msg, config.messages.disablemessage);
        }
    } else {
        if (command.help.category === "Dev") {
            if (config.staff.includes(msg.author.id)) {
                command.run(client, con, config, msg, args, fn);
            } else {
                fn.Reply(msg, "Sorry, This is a Dev Command")
            }
        } else {
            command.run(client, con, config, msg, args, fn);
        }
        
    }

})
client.on("guildDelete", function (guild) {
    // Delete all records of that server regarding catagories
    // channels will be removed from db with the intervals
    con.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        let gid = guild.id;
        let sql = SqlString.format('DELETE FROM catagory WHERE gid=?', [gid]);
        d.query(sql, async (er, re) => {
            if (er) console.error(er)
            if (!re) console.log("Bot has left guild: " + gid);
            if (re) console.log("Bot has left guild: " + gid);
        })

        d.release(function (err) {
            if (err) {
                ErrorMessage("close connection", err);
            }
            console.info("Ended Connection");
            // The connection is terminated now
        });
    });

});
client.on("error", (er) => {
    console.error(er);
})
client.on("voiceStateUpdate", async (oldState, newState) => {
    if (oldState.id === newState.id) {
        if (oldState.channelID != newState.channelID) {
            let uid = oldState.id;
            let channelid = newState.channelID;
            let oldchan = oldState.channelID;
            if (oldchan === channelid) return;
            con.getConnection(function (err, d) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                //#region Join chan's
                var sql = SqlString.format('SELECT * FROM catagory WHERE joinchan=?', [channelid]);
                d.query(sql, async (er, res) => {
                    if (er) console.log(er);
                    if (!res) return;
                    if (res.length > 0) {
                        let u = client.users.cache.get(uid);
                        let template = `${u.username}'s Room`;
                        let newchan = await oldState.guild.channels.create(template, {
                            type: 'voice',
                            parent: newState.channel.parent.id,
                        })
                        newState.setChannel(newchan);
                        var sql2 = SqlString.format('INSERT INTO channels SET id=?, oid=?', [newchan.id, uid]);
                        d.query(sql2, async (er2, res2) => {
                            if (er2) console.error(er);
                            if (!res2) console.error("Bot could not insert into db");
                            if (res2) console.log("New channel created");
                        })
                    }
                })
                //#endregion
                //#region Temp Chan Deletes
                var sql4 = SqlString.format('SELECT * FROM channels WHERE id=?', [oldchan]);
                d.query(sql4, async (er, res) => {
                    if (er) console.log(er);
                    if (!res) return;
                    if (res.length > 0) {
                        let vc = oldState.guild.channels.cache.get(oldState.channelID);
                        if (vc.members.size < 1) {
                            // https://github.com/Tomato6966/Discord-Join-to-Create/blob/main/jointocreate.js
                            vc.delete()
                            //yeet the info from the database
                            let sqlzor = SqlString.format('DELETE FROM channels WHERE id=?', [oldchan]);
                            d.query(sqlzor, async (er, res234) => {
                                if (er) console.error(er);
                                if (!res234) console.error("Could not delete entry");
                                if (res234) console.log("Channel yeeted");
                            })
                        }
                    }
                })
                //#endregion
                d.release(function (err) {
                    if (err) {
                        ErrorMessage("close connection", err);
                    }
                    console.info("Ended Connection");
                    // The connection is terminated now
                });
            });
            

            
        }
    }
    
});

client.login(config.bot.token).catch(console.error());