const Discord = module.require("discord.js");
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
                        if (locked === 0) {
                            fn.Reply(msg, "That channel is not locked");
                            return;
                        }
                        let vccheck;
                        msg.member.voice.channel.members.each((memberinvc) => {
                            if (member.id != memberinvc.id) return;
                            vccheck = 1;
                        })
                        if (vccheck != 1) return client.functions.Reply(msg, `<@${member.id}> is not in the voice channel`);
                        member.voice.kick();
                        client.functions.AddModLog(client, msg.guild.id, msg.author.id, `<@${member.id}> kicked from VC`, msg.member.voice.channel, '3')
                        client.functions.Reply(msg, `Successfully kicked <@${member.id}> from the channel`);
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