const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring')
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        let pid = args[0];
        if (!pid) fn.Reply('you must supply arguments for this command, try ' + config.bot.prefix + 'help template  for more info');
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
                        console.error(err);
                    }
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
                        console.error(err);
                    }
                });
            });
            /* */
        }

    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "template",
    //aliases: [""],
    description: "Updates the Channel's template. instead of <new_template> you can put reset to reset to default. %INC% = Increment %USERNAME% = username   %NICKNAME% = nickname",
    usage: "template <category_id> <new_template>",
    category: "Administrative"
}