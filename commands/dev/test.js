
const Discord = require("discord.js")
const fs = require("fs");
const mysql = module.require("mysql");

exports.run = (client, con, config, msg, args, fn) => {
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
                let t = res[0].template;
                let uname = '%USERNAME%';
                let nname = '%NICKNAME%';
                let increment_chan = '%INC%';

                let cmd = config.bot.prefix + 'test ';
                let text = msg.content.slice(cmd.length);


                msg.channel.send("New Channel Name: " + text)
            }
        });

        d.release(function (err) {
            if (err) {
                ErrorMessage("close connection", err);
            }
            console.info("Ended Connection");
            // The connection is terminated now
        });
    });
};
module.exports.help = {
    name: "test",
    //aliases: [""],
    description: "Test command for Dev tasks",
    usage: "test",
    category: "Dev"
}