const Discord = module.require("discord.js");
const mysql = require("mysql");
const SqlString = require("sqlstring");
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        // create the catagory & join channel
        let newcat = await msg.guild.channels.create('new-category', {
            type: 'category',
            permissionsOverwrites: [
                { // @everyone Role
                    id: msg.guild.id,
                    allow: ['VIEW_CHANNEL', 'CONNECT']
                },
                { 
                    id: client.user.id,
                    allow: ['MANAGE_CHANNELS', 'VIEW_CHANNEL']
                }
            ]
        });
        let newchan = await msg.guild.channels.create('Join to Create', {
            type: 'voice',
            parent: newcat.id,
            permissionsOverwrites: [
                { // @everyone Role
                    id: msg.guild.id,
                    allow: ['VIEW_CHANNEL', 'CONNECT']
                },
                {
                    id: client.user.id,
                    allow: ['MANAGE_CHANNELS', 'VIEW_CHANNEL']
                }
            ]
        })
        

        let gid = msg.guild.id;
        let joinchan = newchan.id;
        var sql = SqlString.format('INSERT INTO catagory SET gid=?, joinchan=?', [gid, joinchan]);
        con.getConnection(function (err, d) {
            if (err) {
                console.error("error connecting: " + err.stack);
                return;
            }

            d.query(sql, (er, results) => {
                if (er) console.log(er);
                if (!results) {
                    console.error(er);
                    fn.Reply(msg, config.messages.oof);
                }
                if (results) {
                    fn.Reply(msg, "New category has been created");
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
    catch (error) {
        console.log(error);
        fn.Reply("Could not create new channel. If this problem persists, Please contact the bot dev")
    }
}
module.exports.help = {
    name: "newcat",
    //aliases: [""],
    description: "creates a new catagory for voice chat",
    usage: "",
    category: "General"
}