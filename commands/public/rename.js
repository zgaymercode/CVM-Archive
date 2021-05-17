const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring')
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        msg.delete();
        // CURRENT_TIMESTAMP()
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
                        
                        let vc = msg.member.voice.channel;
                        let perms = fn.vcOwnerCheck(vc.id, msg.author.id, msg);
                        if (perms) {
                            let rename = re[0].last_rename;
                            let cooldown = config.bot.renamecooldown;
                            let timesincelast = fn.timesince(rename);
                            if (timesincelast < cooldown) {
                                let timeleft = cooldown - timesincelast;
                                fn.Reply(msg, "You must wait another " + timeleft + " minutes before renaming this channel again" )
                            } else {
                                var sql2 = SqlString.format('UPDATE channels SET last_rename=CURRENT_TIMESTAMP() WHERE id=?', [vcid]);
                                d.query(sql2, async (er2, re2) => {
                                    if (er2) console.error(er2);
                                    let cmd = config.bot.prefix + "rename";
                                    let text = msg.content.slice(cmd.length);
                                    vc.setName(text, "Channel Rename Command used by: " + msg.author.id);
                                    fn.Reply(msg, "Successfully renamed channel")
                                })
                            }
                            
                        } else {
                            fn.Reply(msg, config.messages.notowner)
                        }
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
        } else {
            fn.Reply(msg, config.messages.notinvoice)
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "rename",
    //aliases: [""],
    description: "Renames a channel",
    usage: "",
    category: "General"
}