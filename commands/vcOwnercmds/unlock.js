const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
        let vcid = msg.member.voice.channel.id;
        let uid = msg.author.id;
        var sql = SqlString.format('UPDATE channels SET locked=0 WHERE id=?', [vcid]);
        con.getConnection(function (err, d) {
            if (err) {
                console.error("error connecting: " + err.stack);
                return;
            }
            let sqljccheck = SqlString.format(`SELECT * FROM channels WHERE id=?`, [vcid]);
            d.query(sqljccheck, (erjccheck, rejccheck) => {
                if (erjccheck) return console.error(erjccheck);
                if (!rejccheck) return console.log(`can't find ${vcid} in channels`);
                let jc = rejccheck[0].joinchan;
                var sql234 = SqlString.format('SELECT * FROM joinchans WHERE joinchan=?', [jc]);
                d.query(sql234, (er234, res234) => {
                    if (er234) console.error(er234);
                    if (!res234) console.log("cant find joinchannel on unlock command")
                    if (res234) {
                        let lockable = res234[0].lockable;
                        let joinchan = res234[0].joinchan;
                        let jc = msg.guild.channels.cache.get(joinchan);

                        if (lockable === 0) fn.Reply(msg, "This channel is not allowed to be unlocked")
                        if (lockable === 1) {
                            var sql = SqlString.format('UPDATE channels SET locked="0" WHERE id=?', [vcid]);
                            d.query(sql, async (er, re) => {
                                if (er) console.error(er);
                                if (!re) fn.Reply(msg, config.messages.oof)
                                if (re) {
                                    let vc = msg.guild.channels.cache.get(vcid);
                                    client.functions.AddModLog(client, msg.guild.id, msg.author.id, `Channel Unlocked`, vc, '3')
                                    if (msg.needsAdminLog === 1) {
                                        client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `Unlocked ${vc.id}`);
                                    }
                                    await vc.overwritePermissions(jc.permissionOverwrites).then(() => {
                                        fn.Reply(msg, "Successfully unlocked channel");
                                    })
                                }
                            })
                        }

                    }
                })
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
    name: "unlock",
    //aliases: [""],
    description: "resets the channel to the join channel's permissions. assuming the channel is allowed to be unlocked",
    usage: "unlock",
    category: "VC Owner Command",
    cooldown: 0,
    maintenancemode: 0
}