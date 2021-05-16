const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring');
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        msg.delete();
        
        if (msg.member.voice.channel) {
            let vcid = msg.member.voice.channel.id;
            let uid = msg.author.id;
            let hasperm = fn.vcOwnerCheck(vcid, uid, msg);
            if (hasperm) {
                var sql = SqlString.format('UPDATE channels SET locked="1" WHERE id=?', [vcid]);
                con.getConnection(function (err, d) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    d.query(sql, async (er, re) => {
                        if (er) console.error(er);
                        if (!re) fn.Reply(msg, config.messages.oof)
                        if (re) {
                            let vc = msg.guild.channels.cache.get(vcid);
                            //let member = vc.guild.roles.cache.get(config.server.memberrole);
                            vc.updateOverwrite(
                                vc.guild.roles.everyone,
                                {
                                    VIEW_CHANNEL: false,
                                    CONNECT: true
                                }
                            );
                            /*
                            vc.updateOverwrite(
                                member,
                                {
                                    VIEW_CHANNEL: false
                                }
                            )
                            */
                            fn.Reply(msg, 'Successfully locked channel')
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
                fn.Reply(msg, config.messages.notowner)
            }
        } else {
            fn.Reply(msg, "You are not in a voice chat")
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "lock",
    //aliases: [""],
    description: "locks a channel",
    usage: "",
    category: "General"
}