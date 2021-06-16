const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
        let bjoinchan = args[0];
        let bar = args[1];
        let joinchan = bjoinchan.toString().split(' ').join('');
        let ar = bar.toString().split(' ').join('')
        if (!isNaN(joinchan)) {
            if (!isNaN(ar)) {
                var sql = SqlString.format('UPDATE joinchans SET increment=? WHERE joinchan=?', [ar, joinchan]);
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
                            console.error(err);
                        }
                    });
                });
            } else {
                fn.Reply(msg, 'The increment you provided is not a number')
            }
        } else {
            fn.Reply(msg, 'The category id you provided is not a number')
        }

    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "increment",
    //aliases: [""],
    description: "Updates the incremental number for a joinchannel",
    usage: "increment <joinchanid> <increment_#>",
    category: "Administrative",
    maintenancemode: 0
}