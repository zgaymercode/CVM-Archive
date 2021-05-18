
const Discord = require('discord.js');
const client = new Discord.Client();
const { sep } = require('path');
const mysql = require("mysql");
const { readdirSync } = require("fs");
const SqlString = require("sqlstring");
const moment = require("moment");
exports.run = async (client, con, config, msg, args, fn) => {
    try {
        let gid = msg.guild.id
        if (args[0] === 'add') {
            args.splice('add', 1); // remove add from the args
            for (let i = 0; i < args.length; i++) {
                let word = args[i].toLowerCase();
                con.getConnection(function (err, d) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    var sql = SqlString.format('INSERT INTO blacklistedwords SET word=?, gid=?', [word, gid]);
                    d.query(sql, (err, res) => {
                        if (err) console.error(err);
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
            fn.Reply(msg, "Successfully Added word(s) to the blacklist")

        }
        else if (args[0] === 'list') {
            con.getConnection(function (err, d) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                var sql = SqlString.format('SELECT * FROM blacklistedwords WHERE gid=?', [gid]);
                d.query(sql, (err, res) => {
                    if (err) console.error(err);
                    if (res.length > 0) {
                        
                        for (let i = 0; i < res.length; i++){
                            let word = res[i].word;
                            config.tmp.array.push(word);
                        }
                        let string = config.tmp.array.toString();
                        string2 = string.replace(/,/g, ' ')
                        fn.Reply(msg, `**CURRENT BLACKLIST**\n\n${string2}`)
                    }
                    if (res.length < 1) {
                        fn.Reply(msg, "This server does not have any blacklisted words")
                    }
                    config.tmp.array = [];
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
        else if (args[0] === 'remove') {
            args.splice('remove', 1); // remove remove from the args
            for (let i = 0; i < args.length; i++) {
                let word = args[i].toLowerCase();
                con.getConnection(function (err, d) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    var sql = SqlString.format('DELETE FROM blacklistedwords WHERE word=? AND gid=?', [word, gid]);
                    d.query(sql, (err, res) => {
                        if (err) console.error(err);
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
            fn.Reply(msg, "Successfully removed the items from the blacklist");

        }
        else if (args[0] === "reset") {
            con.getConnection(function (err, d) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                var sql = SqlString.format('DELETE FROM blacklistedwords WHERE gid=?', [gid]);
                d.query(sql, (err, res) => {
                    if (err) console.error(err);
                    if (res.length > 0) {
                        fn.Reply(msg, "Successfully removed all items from the blacklist");
                    } else {
                        fn.Reply(msg, "Could not find anything to yeet, this server's list is blank")
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
        else {
            fn.Reply(msg, "invalid input, run " + config.bot.prefix + "help blistword   for more information on how to use this command")
        }
    } catch (e) {
        console.error(e);
        fn.Reply(msg, "There was an error in the matrix")
    }
}
module.exports.help = {
    name: "blistword",
    aliases: ["wblist"],
    description: "Add/Remove words from your server's blacklist, view currently blacklisted words. reset will yeet all words",
    usage: "blistword add|remove|list word1 word2 word3 ...",
    category: "Under Maintenance"//"Administrative"
}