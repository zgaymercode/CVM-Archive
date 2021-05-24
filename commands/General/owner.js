const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring')
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        if (msg.member.voice.channel) {
            let vcid = msg.member.voice.channel.id;
            var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [vcid]);
            con.getConnection(function (err, d) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                d.query(sql, async (er, re) => {
                    if (er) console.error(er);
                    if (!re) return;
                    if (re) {
                        fn.Reply(msg, "This channel is owned by: <@" + re[0].oid + ">");
                    }
                })
                d.release(function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            });
            
        } else {
            fn.Reply(msg, config.messages.notinvoice)
        }

    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "owner",
    //aliases: [""],
    description: "Shows who the current owner is",
    usage: "owner",
    category: "General"
}