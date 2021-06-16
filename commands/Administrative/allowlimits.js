const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring')
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
        let joinchan = args[0];
        if (!isNaN(joinchan)) {

            let sql;
            switch (args[1]) {
                case 'allow':
                    sql = SqlString.format(`UPDATE joinchans SET adjust_limit='1' WHERE joinchan=?`, [joinchan]);
                    break;
                case 'deny':
                    sql = SqlString.format(`UPDATE joinchans SET adjust_limit='0' WHERE joinchan=?`, [joinchan]);
                    break;
                default:
                    sql = 0;
                    client.functions.Reply(msg, "You must select either Allow or Deny")
            }
            if (sql != 0) {
                client.database.getConnection((error, d) => {
                    if (error) return console.error(error);
                    d.query(sql, async (er2, re2) => {
                        if (er2) return client.functions.Reply(msg, "There was a glitch in the matrix, please contact bot support :3");
                        if (!re2) return client.functions.Reply(msg, `There was an error updating that channel, please contact bot support`)
                        client.functions.Reply(msg, `Successfully updated <#${joinchan}>`);
                    })
                    d.release((error2) => {
                        if (error2) return console.error(error2);
                    })
                })
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
    name: "limits",
    //aliases: [""],
    description: "Enables/Disables the ability to change a channel's limits based on the join channel",
    usage: "limits <joinchan_id> allow|deny",
    category: "Administrative",
    maintenancemode: 0
}