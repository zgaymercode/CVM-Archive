const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring')
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
        let pid = args[0];
        if (!pid) fn.Reply('you must supply arguments for this command, try ' + config.bot.prefix + 'help template  for more info');
        if (args[1] === 'reset') {
            con.getConnection(function (err, d) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                var sql = SqlString.format('UPDATE joinchans SET template=NULL WHERE joinchan=?', [pid]);
                d.query(sql, async (er, re) => {
                    if (er) console.error(er);
                    if (!re) return;
                    if (re) {
                        fn.Reply(msg, "Template Successfully Updated");
                        client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `reset <#${pid}>'s template`)
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
            args.splice(0, 1)
            let ar = args.toString().split(/,/).join(' ');
            
            var sql = SqlString.format('UPDATE joinchans SET template=? WHERE joinchan=?', [ar, pid]);
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
                        client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `set <#${pid}>'s template to '${ar}'`);
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
    usage: "template <join_channel_id> <new_template>",
    category: "Administrative",
    maintenancemode: 0
}