const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring')
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
        let joinchan = args[0];
        if (!isNaN(joinchan)) {
            if (args[1] === 'enable') {
                con.getConnection(function (err, d) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    var sql = SqlString.format('UPDATE catagory SET lockable="1" WHERE joinchan=?', [joinchan]);
                    d.query(sql, async (er, re) => {
                        if (er) console.error(er);
                        if (!re) return;
                        if (re) {
                            fn.Reply(msg, `Channels created using <#${joinchan}> will now be able to be locked`);
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

            }
            if (args[1] === 'disable') {
                con.getConnection(function (err, d) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    var sql = SqlString.format('UPDATE catagory SET lockable="0" WHERE joinchan=?', [joinchan]);
                    d.query(sql, async (er, re) => {
                        if (er) console.error(er);
                        if (!re) return;
                        if (re) {
                            fn.Reply(msg, `Channels created using <#${joinchan}> will no longer be able to be locked`);
                        }
                    })
                    d.release(function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                });

            }
        } else {
            fn.Reply(msg, "join channel Id supplied is not numeric")
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "lockable",
    //aliases: [""],
    description: "Enables/Disables the ability to lock a channel based on the join channel",
    usage: "lockable <joinchan_id> enable|disable",
    category: "Administrative",
    maintenancemode: 0
}