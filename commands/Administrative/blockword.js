
const Discord = require('discord.js');
const client = new Discord.Client();
const { sep } = require('path');
const mysql = require("mysql");
const { readdirSync } = require("fs");
const SqlString = require("sqlstring");
const moment = require("moment");
exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    let gid = msg.guild.id
    try {
        switch (args[0]){
            case "add":
                args.splice('add', 1); // remove add from the args
                for (let i = 0; i < args.length; i++) {
                    let word = args[i].toLowerCase();
                    con.getConnection(function (err, d) {
                        if (err) {
                            console.error("error connecting: " + err.stack);
                            return;
                        }
                        var sql = SqlString.format('INSERT INTO forbiddonwords SET word=?, gid=?', [word, gid]);
                        d.query(sql, (err, res) => {
                            if (err) console.error(err);
                        })
                        d.release(function (err) {
                            if (err) {
                                console.error(err);
                            }
                        });
                    });
                }
                fn.Reply(msg, "Successfully Added word(s) to the blocked word list")
                break;
            case 'list':
                con.getConnection(function (err, d) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    var sql = SqlString.format('SELECT * FROM forbiddonwords WHERE gid=?', [gid]);
                    d.query(sql, (err, res) => {
                        if (err) console.error(err);
                        if (res.length > 0) {

                            for (let i = 0; i < res.length; i++) {
                                let word = res[i].word;
                                config.tmp.array.push(word);
                            }
                            let string = config.tmp.array.toString();
                            string2 = string.replace(/,/g, ' ')
                            fn.Reply(msg, `**CURRENT DENIED LIST**\n\n${string2}`)
                        }
                        if (res.length < 1) {
                            fn.Reply(msg, "This server does not have anything on it's blocked word list")
                        }
                        config.tmp.array = [];
                    })
                    d.release(function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                });
                break;
            case 'remove':
                args.splice('remove', 1); // remove remove from the args
                for (let i = 0; i < args.length; i++) {
                    let word = args[i].toLowerCase();
                    con.getConnection(function (err, d) {
                        if (err) {
                            console.error("error connecting: " + err.stack);
                            return;
                        }
                        var sql = SqlString.format('DELETE FROM forbiddonwords WHERE word=? AND gid=?', [word, gid]);
                        d.query(sql, (err, res) => {
                            if (err) console.error(err);
                            if (!res) return;
                        })
                        d.release(function (err) {
                            if (err) {
                                console.error(err);
                            }
                        });
                    });
                }
                fn.Reply(msg, "Successfully removed the items from the denied list");
                break;
            case 'reset':
                con.getConnection(function (err, d) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    var sql = SqlString.format('DELETE FROM forbiddonwords WHERE gid=?', [gid]);
                    d.query(sql, (err, res) => {
                        if (err) console.error(err);
                        fn.Reply(msg, "Successfully removed all items from the denied list");
                    })
                    d.release(function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                });
                break;
            default:
                fn.Reply(msg, `invalid input, run ${config.bot.prefix}help blocklist   for more information on how to use this command`)
                break;
        }
    } catch (e) {
        console.error(e);
        fn.Reply(msg, "There was an error in the matrix")
    }
}
module.exports.help = {
    name: "blockword",
    aliases: ["blist"],
    description: "Add/Remove words from your server's block list, view currently blocked words. reset will yeet all words from the list",
    usage: "blockword add|remove|list word1 word2 word3 ...",
    category: "Administrative",
    maintenancemode: 0
}