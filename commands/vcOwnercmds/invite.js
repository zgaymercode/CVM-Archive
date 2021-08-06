const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
        let vcid = msg.member.voice.channel.id;
        let uid = msg.author.id;
        let vc = msg.guild.channels.cache.get(vcid);
        let member = msg.mentions.members.first()
        if (member) {
            var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [vcid]);
            con.getConnection(function (err, d) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                d.query(sql, async (er, re) => {
                    if (er) console.error(er);
                    if (!re) fn.Reply(msg, config.messages.oof)
                    if (re) {
                        let locked = re[0].locked;
                        if (locked === 0) {
                            fn.Reply(msg, "That channel is not locked");
                            return;
                        }
                        for (let i = 0; i < args.length; i++) {
                            if (i > 4) return;
                            let ar1 = args[i].toString().replace(/<@!/g, '')
                            let ar2 = ar1.toString().replace(/>/g, '')
                            member = msg.guild.members.cache.get(ar2);
                            vc.updateOverwrite(
                                member,
                                {
                                    CONNECT: true,
                                    VIEW_CHANNEL: true
                                }
                            )
                            if (msg.needsAdminLog === 1) {
                                client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `invited <@${member.id}> to ${vc.id}`)
                            }
                            client.functions.AddModLog(client, msg.guild.id, msg.author.id, `<@${member.id}> Invited`, vc, '3');
                            client.functions.Reply(msg, `Successfully invited <@${member.id}> to the channel`);
                        }
                    }
                })
                d.release(function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            });

        } else {
            fn.Reply(msg, "You must mention a member for me to invite")
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "invite",
    //aliases: [""],
    description: "invites a member to a locked channel. Up to 5 members can be invited at once",
    usage: "invite @member1",
    category: "VC Owner Command",
    cooldown: 5,
    maintenancemode: 0
}