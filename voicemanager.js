/*
Welcome to Community Voice Manager
Author: WolfTribe Dev Team

                               ,|
                             //|                              ,|
                           //,/                             -~ |
                         // / |                         _-~   /  ,
                       /'/ / /                       _-~   _/_-~ |
                      ( ( / /'                   _ -~     _-~ ,/'
                       \~\/'/|             __--~~__--\ _-~  _/,
               ,,)))))));, \/~-_     __--~~  --~~  __/~  _-~ /
            __))))))))))))));,>/\   /        __--~~  \-~~ _-~
           -\(((((''''(((((((( >~\/     --~~   __--~' _-~ ~|
  --==//////((''  .     `)))))), /     ___---~~  ~~\~~__--~
          ))| @    ;-.     (((((/           __--~~~'~~/
          ( `|    /  )      )))/      ~~~~~__\__---~~__--~~--_
             |   |   |       (/      ---~~~/__-----~~  ,;::'  \         ,
             o_);   ;        /      ----~~/           \,-~~~\  |       /|
                   ;        (      ---~~/         `:::|      |;|      < >
                  |   _      `----~~~~'      /      `:|       \;\_____//
            ______/\/~    |                 /        /         ~------~
          /~;;.____/;;'  /          ___----(   `;;;/
         / //  _;______;'------~~~~~    |;;/\    /
        //  | |                        /  |  \;;,\
       (<_  | ;                      /',/-----'  _>
        \_| ||_                     //~;~~~~~~~~~
            `\_|                   (,~~
                                    \~\
                                     ~~
*/
//#region init
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');
const { sep } = require('path');
const mysql = require("mysql");
const { readdirSync } = require("fs");
const SqlString = require("sqlstring");
const { promisify } = require("util");

const readdir = promisify(require("fs").readdir);

const fn = require('./functions.js');
["commands", "aliases", "slashcmds"].forEach((x) => (client[x] = new Discord.Collection()));
//#endregion
//#region LOAD ALL COMMANDS
const load = async (dir = "./commands/") => {
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
                //console.log(`Loaded command ${pull.help.name}.`);
            } else {
                // we check if the command is loaded else throw a error saying there was command it didn't load
                console.error(`Error loading command in ${dir}${dirs}${file}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`);
                // we use continue to load other commands or else it will stop here
                continue;
            }
            // we check if the command has aliases, is so we add it to the collection
            if (pull.help.aliases && typeof pull.help.aliases === "object") {
                pull.help.aliases.forEach((alias) => {
                    // we check if there is a conflict with any other aliases which have same name
                    if (client.aliases.get(alias))
                        return console.warn(`Two commands or more commands have the same aliases ${alias}`);
                    client.aliases.set(alias, pull.help.name);
                });
            }
        }
    });
    let dir2 = "./slashcmds/";
    const cmdFiles = await readdir(dir2);

    cmdFiles.forEach((file2, i) => {
        const cmd = require(`${dir2}${file2}`);
        let name = cmd.name;
        if (name === "template") return;
        if (client.slashcmds.get(name)) {
            console.warn(`Two or more slash commands have the same name: ${name}`);
            return;
        }
        if (typeof name === 'string') {
            client.slashcmds.set(name, cmd)
        } else {
            console.warn(`Error loading file in ${dir2}${file2}. you have a missing name or name is not a string`)
            return;
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
    m = 100; // max intervals before restart
    client.user.setActivity(config.bot.startstatus, { type: "PLAYING" });
    fn.consolelog(client, m);
    fn.ChannelCleanup(client);
    fn.CatagoryCleanup(client);
    fn.FilterListCleanup(client);
    setInterval(() => {
        fn.BotStatus(client);
        fn.ChannelCleanup(client);
        fn.CatagoryCleanup(client);
        fn.FilterListCleanup(client);
        fn.consolelog(client, m);
    }, 150000); // every 2.5 minutes
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
    msg.delete()
    if (config.bot.cmds_enabled == 0) {
        // user needs to be a part of bot staff for commands to run
        if (config.staff.includes(msg.author.id)) {
            command.run(client, con, config, msg, args, fn);
            return;
        } else {
            fn.Reply(msg, config.messages.disablemessage);
            return;
        }
    } else {
        if (command.help.category === "Dev") {
            if (config.staff.includes(msg.author.id)) {
                command.run(client, con, config, msg, args, fn);
                return;
            } else {
                fn.Reply(msg, "Sorry, This is a Dev Command")
                return;
            }
        }
        if (command.help.category === "Under Maintenance") {
            if (config.staff.includes(msg.author.id)) {
                command.run(client, con, config, msg, args, fn);
                return;
            } else {
                fn.Reply(msg, "Sorry, This command is under Maintenance")
                return;
            }
        }
        if (command.help.category === "Administrative") {
            if (msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")) {
                command.run(client, con, config, msg, args, fn);
                return;
            } else {
                fn.Reply(msg, config.messages.nomanager)
                return;
            }
        }
        if (command.help.category === "VC Owner Command") {
            if (msg.member.voice.channel) {
                if (fn.vcOwnerCheck(msg.member.voice.channel.id, msg.author.id, msg)) {
                    command.run(client, con, config, msg, args, fn);
                    return;
                } else {
                    fn.Reply(msg, config.messages.nomanager)
                    return;
                }
            } else {
                fn.Reply(msg, "You are not in a voice chat")
                return;
            }
        }
        command.run(client, con, config, msg, args, fn);
        
    }
    
})
client.on("guildDelete", function (guild) {
    console.log("Bot has left: " + guild.id);
    fn.ChannelCleanup(client);
    fn.CatagoryCleanup(client);
    con.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        //#region YEET all the server's blacklisted words
        var sql = SqlString.format('DELETE FROM blacklistedwords WHERE gid=?', [guild.id]);
        d.query(sql, (err, res) => {
            if (err) console.error(err);
        })
        //#endregion
        d.release(function (err) {
            if (err) {
                console.error(err);
            }
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
                    if (er) console.error(er);
                    if (!res) return;
                    if (res.length > 0) {
                        let guild = client.channels.cache.get(newState.channelID).guild;
                        let u = client.users.cache.get(uid);
                        let m = guild.members.cache.get(uid);
                        let t = res[0].template;
                        let inc = res[0].increment;
                        if (t === null) {
                            template = `${u.username}'s Room`; // use the default template
                        } else {
                            // use the user generated template
                            let activities = m.user.presence.activities;
                            for (let i = 0; i < activities.length; i++){
                                let act = activities[i];
                                if (act.type === "PLAYING") {
                                    game = act.name;
                                    break;
                                } else {
                                    continue;
                                }                                
                            }
                            if (!game) game = "No Game Detected";
                            let PreStep = t.replace(/%GAME%/g, game);
                            let step1 = PreStep.replace(/%USERNAME%/g, u.username)
                            let step2 = step1.replace(/%INC%/g, inc + 1);
                            template = step2.replace(/%NICKNAME%/g, m.nickname)
                            d.query(`UPDATE catagory SET increment = increment + 1 WHERE joinchan='${channelid}'`, (er3, res3) => {
                                if (er3) console.error(er3);
                                return;
                            })
                        }
                        let newchan = await newState.guild.channels.create(template, {
                            type: 'voice',
                            parent: newState.channel.parent.id,
                            userLimit: newState.channel.userLimit
                        })
                        newState.setChannel(newchan);
                        var sql2 = SqlString.format('INSERT INTO channels SET id=?, oid=?, created=CURRENT_TIMESTAMP()', [newchan.id, uid]);
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
                    if (er) console.error(er);
                    if (!res) return;
                    if (res.length > 0) {
                        let vc = oldState.guild.channels.cache.get(oldState.channelID);
                        if (vc.members.size < 1) {
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
                        console.error(err);
                    }
                });
            });
            

            
        }
    }
    
});

client.ws.on('INTERACTION_CREATE', async interaction => {
    // Slash Commands Handler
    let cmdname = interaction.data.name;
    if (client.slashcmds.has(cmdname)) {
        let cmd;
        cmd = client.slashcmds.get(cmdname);
        cmd.run(client, interaction);
    }
    return;
});
client.login(config.bot.token).catch(console.error());