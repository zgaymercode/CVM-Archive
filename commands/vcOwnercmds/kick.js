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
                        if (locked === 0 && activityStatus === 0) {
                            fn.Reply(msg, "Channel needs to be either a lockable channel or an activity channel to use this command");
                            return;
                        } else {
                            let vccheck;
                            msg.member.voice.channel.members.each((memberinvc) => {
                                if (member.id != memberinvc.id) return;
                                vccheck = 1;
                            })
                            if (vccheck != 1) {
                                client.functions.Reply(msg, `<@${member.id}> has been denied access joining the channel`);
                                vc.updateOverwrite(
                                    member.id,
                                    {
                                        CONNECT: false
                                    }
                                )
                                client.functions.AddModLog(client, msg.guild.id, msg.author.id, `<@${member.id}> blocked from joining VC`, msg.member.voice.channel, '3')
                                return;
                            }
                            member.voice.kick();
                            let vc = msg.member.voice.channel;
                            vc.updateOverwrite(
                                member.id,
                                {
                                    CONNECT: false
                                }
                            )
                            client.functions.AddModLog(client, msg.guild.id, msg.author.id, `<@${member.id}> kicked from VC`, msg.member.voice.channel, '3')
                            client.functions.Reply(msg, `Successfully kicked <@${member.id}> from the channel`);
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
            fn.Reply(msg, "You must mention a member for me to kick")
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "kick",
    //aliases: [""],
    description: "kicks a member from a locked channel",
    usage: "kick @member",
    category: "VC Owner Command",
    maintenancemode: 0
}