const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
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
                    let joinchan = re[0].joinchan;
                    let cooldown = config.bot.renamecooldown;
                    let timesincelast = fn.timesince(rename);
                    let text = args.toString().split(/,/).join(' ');
                    if (timesincelast < cooldown && rename != null) {
                        let timeleft = cooldown - timesincelast;
                        fn.Reply(msg, "You must wait another " + timeleft + " minutes before renaming this channel again")
                    } else {
                        let searchPrefix = SqlString.format(`SELECT * FROM joinchans WHERE joinchan=?`, [joinchan]);
                        d.query(searchPrefix, (error_prefixcheck, results_prefixcheck) => {
                            if (error_prefixcheck) console.error(error_prefixcheck);
                            if (results_prefixcheck.length < 1) return client.functions.Reply(msg, "An error occured");
                            let prefix = results_prefixcheck[0].prefix;
                            if (prefix === null) prefix = '';

                            let text = args.toString().split(/,/).join(' ');
                            if (text.includes(prefix)) {
                                prefix = '';
                            }
                            let gid = msg.guild.id
                            let blisted;
                            let blistwords = [];
                            // gid 0 === globally blacklisted
                            var sql = SqlString.format('SELECT * FROM forbiddonwords WHERE gid=? OR gid="0"', [gid]);
                            d.query(sql, async (errre, rre) => {
                                if (errre) console.error(errre);
                                if (rre.length < 1) {
                                    var sql2 = SqlString.format('UPDATE channels SET last_rename=CURRENT_TIMESTAMP() WHERE id=?', [vcid]);
                                    d.query(sql2, async (er2, re2) => {
                                        if (er2) console.error(er2);
                                        vc.setName(prefix + text, `Channel Rename Command used by: ${msg.author.username}`);
                                        if (msg.needsAdminLog === 1) {
                                            client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `Renamed <@${vcid}> to ${prefix}${text}`);
                                        }
                                        client.functions.AddModLog(client, msg.guild.id, msg.author.id, `Channel renamed to ${prefix}${text}`, vc, '2')
                                        fn.Reply(msg, "Successfully renamed channel")
                                        if (!re2) console.log('Channel renamed, but could not update db for last rename');
                                    })
                                }
                                if (rre.length > 0) {

                                    for (i = 0; i < rre.length; i++) {
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
                                        fn.Reply(msg, "Prohibited Word detected, Please try a different name");
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
                        })

                    }
                }
            })


            d.release(function (err) {
                if (err) {
                    console.error(err);
                }
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
    category: "VC Owner Command",
    cooldown: 0,
    maintenancemode: 0
}