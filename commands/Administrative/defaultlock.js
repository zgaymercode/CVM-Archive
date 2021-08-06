const SqlString = module.require('sqlstring')
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
        let joinchan = args[0];
        if (!isNaN(joinchan)) {
            con.getConnection(function (err, d) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                switch (args[1]) {
                    case 'locked':
                        var sql = SqlString.format('UPDATE joinchans SET autolock="1" WHERE joinchan=?', [joinchan]);
                        d.query(sql, async (er, re) => {
                            if (er) console.error(er);
                            if (!re) return;
                            if (re) {
                                fn.Reply(msg, `Channels created using <#${joinchan}> will be locked on creation`);
                                client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `set channels created using <#${joinchan}> to be locked on creation`)
                            }
                        })
                        break;
                    case 'unlocked':
                        var sql = SqlString.format('UPDATE joinchans SET autolock="0" WHERE joinchan=?', [joinchan]);
                        d.query(sql, async (er, re) => {
                            if (er) console.error(er);
                            if (!re) return;
                            if (re) {
                                fn.Reply(msg, `Channels created using <#${joinchan}> will be unlocked on creation`);
                                client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `disallowed channels created using <#${joinchan}> to be unlocked on creation`)
                            }
                        })
                        break;
                    default:
                        fn.Reply(msg, `You must select either locked or unlocked as the default state of a channel`);
                        break;

                }

                d.release(function (err) { if (err) { console.error(err); } });
            });
        } else {
            fn.Reply(msg, "join channel Id supplied is not numeric")
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "defaultlock",
    //aliases: [""],
    description: "set's the default lock state of a channel. auto-locking channels must also be set to lockable if you want the members to be able to unlock the channels",
    usage: "defaultlock <joinchan_id> locked|unlocked",
    category: "Administrative",
    cooldown: 0,
    maintenancemode: 0
}