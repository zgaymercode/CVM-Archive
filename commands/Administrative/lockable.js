const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring')
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        let pid = args[0];
        if (!isNaN(pid)) {
            if (args[1] === 'enable') {
                con.getConnection(function (err, d) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    var sql = SqlString.format('UPDATE catagory SET lockable="1" WHERE pid=?', [pid]);
                    d.query(sql, async (er, re) => {
                        if (er) console.error(er);
                        if (!re) return;
                        if (re) {
                            fn.Reply(msg, "Channels created in that category will now be able to be locked");
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
                    var sql = SqlString.format('UPDATE catagory SET lockable="0" WHERE pid=?', [pid]);
                    d.query(sql, async (er, re) => {
                        if (er) console.error(er);
                        if (!re) return;
                        if (re) {
                            fn.Reply(msg, "Channels created in that category will no longer be able to be locked");
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
            fn.Reply(msg, "Parent Id supplied is not numeric")
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "lockable",
    //aliases: [""],
    description: "Enables/Disables the ability to lock a channel within a category",
    usage: "lockable <category_id> enable|disable",
    category: "Administrative"
}