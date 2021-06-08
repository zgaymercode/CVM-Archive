const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
        let vcid = msg.member.voice.channel.id;
        let pid = msg.member.voice.channel.parentID;
        if (args[0] === 'memberrole') {
            let memberrole = msg.mentions.roles.first();
            if (memberrole) {
                con.getConnection(function (err, d) {
                    if (err) console.error(err);
                    let id = memberrole.id;
                    var sql = SqlString.format('UPDATE catagory SET memberrole=? WHERE pid=?', [id, pid]);
                    d.query(sql, async (er, re) => {
                        if (er) console.error(er);
                        if (!re) return;
                        if (re) {
                            fn.Reply(msg, "Member Role Successfully Updated");
                        }
                    })
                    d.release(function (err) {
                        if (err) console.error(err);
                    });
                })
            } else {
                fn.Reply(msg, "You must @mention a role to set this category's member role")
            }

            return;
        }
        con.getConnection(function (err, d) {
            if (err) {
                console.error("error connecting: " + err.stack);
                return;
            }
            var sql234 = SqlString.format('SELECT * FROM catagory WHERE pid=?', [pid]);
            d.query(sql234, (er234, res234) => {
                if (er234) console.error(er234);
                if (res234) {
                    let lockable = res234[0].lockable;
                    if (lockable === 0) fn.Reply(msg, "This channel is not allowed to be locked")
                    if (lockable === 1) {
                        
                        var sql234 = SqlString.format('SELECT * FROM catagory WHERE pid=?', [pid]);
                        d.query(sql234, (er234, res234) => {
                            if (er234) console.error(er234);
                            if(!res234) console.log("cant find pid")
                            if (res234) {
                                let lockable = res234[0].lockable;
                                let member = res234[0].memberrole;
                                if (lockable === 1) {
                                    var sql = SqlString.format('UPDATE channels SET locked="1" WHERE id=?', [vcid]);
                                    d.query(sql, async (er, re) => {
                                        if (er) console.error(er);
                                        if (!re) fn.Reply(msg, config.messages.oof)
                                        if (re) {
                                            var sql = SqlString.format('UPDATE channels SET locked="1" WHERE id=?', [vcid]);
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
                                                    if (member != null) {
                                                        vc.updateOverwrite(
                                                            member,
                                                            {
                                                                VIEW_CHANNEL: false
                                                            }
                                                        )
                                                    }
                                                    fn.Reply(msg, 'Successfully locked channel')
                                                }
                                            })
                                        }
                                    })
                                }
                                if(lockable === 0){
                                    fn.Reply(msg, "This channel is not allowed to be locked")
                                }
                            }
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
    name: "lock",
    //aliases: [""],
    description: "locks a channel  if member is a staff, they can append memberrole @mention_role and this will set that category to lock out that role as well",
    usage: "lock",
    category: "VC Owner Command",
    maintenancemode: 0
}