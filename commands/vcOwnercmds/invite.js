const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring');
module.exports.run = async (client, con, config, msg, args, fn) => {
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
                        vc.updateOverwrite(
                            member,
                            {
                                CONNECT: true,
                                VIEW_CHANNEL: true
                            }
                        )

                        msg.channel.send("Successfully invited <@" + member.id + "> to the channel").then((m) => {
                            setTimeout(() => {
                                m.delete()
                            }, 5000);
                        })
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
    description: "invites a member to a locked channel",
    usage: "invite @member",
    category: "VC Owner Cmd"
}