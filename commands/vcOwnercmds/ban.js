const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
        let vcid = msg.member.voice.channel.id;
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
                        let activityStatus = re[0].is_stage;
                        let vc = msg.member.voice.channel;
                        if (locked === 0 && activityStatus === 0) {
                            fn.Reply(msg, "Channel needs to be either a lockable channel or an activity channel to use this command");
                            return;
                        } else {
                            msg.member.voice.channel.members.each((memberinvc) => {
                                if (member.id != memberinvc.id) return;
                                vccheck = 1;
                            })
                            if (vccheck === 1) {
                                member.voice.kick();
                                vc.updateOverwrite(
                                    member.id,
                                    {
                                        CONNECT: false
                                    }
                                )
                                client.functions.AddModLog(client, msg.guild.id, msg.author.id, `<@${member.id}> banned from VC`, msg.member.voice.channel, '3')
                                if (msg.needsAdminLog === 1) {
                                    client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `Used the ban command against <@${member.id}>`);
                                }
                                client.functions.Reply(msg, `Successfully banned <@${member.id}> from the channel`);
                            } else {
                                client.functions.Reply(msg, `the member must be in vc with you to ban them, try using the kick command instead, as it will remove their connect perms if member is not in channel`)
                            }

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
            fn.Reply(msg, "You must mention a member for me to ban")
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "ban",
    //aliases: [""],
    description: "bans a member prevents them from joining again",
    usage: "ban @member",
    category: "VC Owner Command",
    cooldown: 5,
    maintenancemode: 0
}