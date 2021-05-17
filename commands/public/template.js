const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring')
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        if (msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")) {
            let pid = args[0];
            
            if (args[1] === 'reset') {
                con.getConnection(function (err, d) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    var sql = SqlString.format('UPDATE catagory SET template=NULL WHERE pid=?', [pid]);
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

                return;
            } else {
                let cmd = config.bot.prefix + "template 843676276794458152 ";
                let input = msg.content.slice(cmd.length);
                let ar = input.toString().split(/[ ,]+/).join(' ');
                
                var sql = SqlString.format('UPDATE catagory SET template=? WHERE pid=?', [ar, pid]);
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
            }
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
    description: "Updates the Channel's template. instead of <new_template> you can put reset to reset to default",
    usage: "template <catagory_id> <new_template>",
    category: "General"
}