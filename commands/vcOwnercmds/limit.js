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
                if (re.length<1) fn.Reply(msg, config.messages.oof)
                let adjustLimitAllowed = re[0].adjust_limit;
                if(adjustLimitAllowed != 1) return client.functions.Reply(msg, `<#${vcid}> does not permit voice channel limits from being edited`)
                let vc = msg.guild.channels.cache.get(vcid);
                let newlim = args[0];
                if (isNaN(newlim)) return fn.Reply(msg, "The limit provided is not an number!");
                if (newlim < 2 && newlim != 0) return fn.Reply(msg, "The limit must be at least 2 or use 0 to remove the limit");
                if (newlim > 99) return fn.Reply(msg, "The limit must be less than 100");
                vc.setUserLimit(newlim)
                let numlim;
                if (newlim != 0) {
                    numlim = newlim;
                } else {
                    numlim = "Unlimited";
                }
                fn.Reply(msg, `Successfully updated channel's limit to: ${numlim}`)
                client.functions.AddModLog(client, msg.guild.id, msg.author.id, `Channel Limit changed to ${numlim}`, vc, '2')
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
    name: "limit",
    //aliases: [""],
    description: "updates the user limit of a voice channel.",
    usage: "limit #",
    category: "VC Owner Command",
    maintenancemode: 0
}