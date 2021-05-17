const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring')
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        if (msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")) {
            
            let ar = args.toString().split(/[ ,]+/).join(' ');
            pid;
            var sql = SqlString.format('SELECT * FROM catagory WHERE pid=?', [pid]);
            con.getConnection(function (err, d) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                d.query(sql, async (er, re) => {
                    if (er) console.error(er);
                    if (!re) return;
                    if (re) {
                        fn.Reply(msg, "Template Successfully Updated");
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
            /* */

        } else {
            fn.Reply(msg, config.messages.nomanager)
        }

    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "template",
    //aliases: [""],
    description: "Updates the Channel's template",
    usage: "template",
    category: "Dev" //"General"
}