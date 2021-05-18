const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring');

module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
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
                    let rename = re[0].last_rename;
                    let cooldown = config.bot.renamecooldown;
                    let timesincelast = fn.timesince(rename);
                    let cmd = config.bot.prefix + "rename";
                    let text = msg.content.slice(cmd.length);
                    if (timesincelast < cooldown && rename != null) {
                        let timeleft = cooldown - timesincelast;
                        fn.Reply(msg, "You must wait another " + timeleft + " minutes before renaming this channel again")
                    } else {
                        /*
                        word Filter fn.BlistedWordCheck(word, msg);
                        */
                        let cmd = config.bot.prefix + 'rename';
                        text = msg.content.slice(cmd.length);
                        let gid = msg.guild.id
                        let blisted;
                        let blistwords = [];
                                                                                            // gid 0 === globally blacklisted
                        var sql = SqlString.format('SELECT * FROM blacklistedwords WHERE gid=? OR gid="0"', [gid]);
                        d.query(sql, async (errre, rre) => {
                            if (errre) console.error(errre);
                            if (rre.length < 1) {
                                var sql2 = SqlString.format('UPDATE channels SET last_rename=CURRENT_TIMESTAMP() WHERE id=?', [vcid]);
                                d.query(sql2, async (er2, re2) => {
                                    if (er2) console.error(er2);

                                    vc.setName(text, "Channel Rename Command used by: " + msg.author.id);
                                    fn.Reply(msg, "Successfully renamed channel")
                                    if (!re2) console.log('Channel renamed, but could not update db for last rename');
                                })
                            }
                            if (rre.length > 0) {
                                
                                for (i = 0; i < rre.length; i++){
                                    word = rre[i].word;
                                    blistwords.push(word);
                                }
                                for (let i = 0; i < args.length; i++) {
                                    let word = args[i];
                                    let w = word.replace(' ', '');
                                    if (blistwords.includes(w.toLowerCase())) {
                                        blisted = 1;
                                    }
                                }
                                
                                if (blisted === 1) {
                                    fn.Reply(msg, "Blacklisted Word detected, Please try a different name");
                                } else {
                                    var sql2 = SqlString.format('UPDATE channels SET last_rename=CURRENT_TIMESTAMP() WHERE id=?', [vcid]);
                                    d.query(sql2, async (er2, re2) => {
                                        if (er2) console.error(er2);

                                        vc.setName(text, "Channel Rename Command used by: " + msg.author.id);
                                        fn.Reply(msg, "Successfully renamed channel")
                                        if (!re2) console.log('Channel renamed, but could not update db for last rename');
                                    })
                                }
                                /* */
                            }
                        })
                       
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
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "rename",
    //aliases: [""],
    description: "Renames the channel that you are in, assuming you're the owner or have the right perms",
    usage: "rename <new name>",
    category: "VC Owner Command"
}