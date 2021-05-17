const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring')
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        let bpid = args[0];
        let bar = args[1];
        let pid = bpid.toString().split(' ').join('');
        let ar = bar.toString().split(' ').join('')
        if (!isNaN(pid)) {
            if (!isNaN(ar)) {
                var sql = SqlString.format('UPDATE catagory SET increment=? WHERE pid=?', [ar, pid]);
                con.getConnection(function (err, d) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    d.query(sql, async (er, re) => {
                        if (er) console.error(er);
                        if (!re) return;
                        if (re) {
                            fn.Reply(msg, "Increment Successfully Updated");
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
                fn.Reply(msg, 'The increment you provided is not a number')
            }
        } else {
            fn.Reply(msg, 'The catagory id you provided is not a number')
        }

    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "increment",
    //aliases: [""],
    description: "Updates the incremental number for a catagory",
    usage: "increment <catagoryid> <increment_#>",
    category: "Administrative"
}