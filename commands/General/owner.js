const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring')
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
        if (msg.member.voice.channel) {
            let vcid = msg.member.voice.channel.id;
            var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [vcid]);
            con.getConnection(function (err, d) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                d.query(sql, async (er, re) => {
                    if (er) console.error(er);
                    if (!re) return;
                    if (re) {
                        let ownerid = re[0].oid;
                        let retrieveCoOwnersObj = re[0].coowner;
                        let jsonObjectFromDB = JSON.parse(retrieveCoOwnersObj)
                        let CurrentOwnersArray = jsonObjectFromDB.coowners || [];

                        ArrayofCoOwnerTags = [];
                        for (let i = 0; i < CurrentOwnersArray.length; i++) {
                            ArrayofCoOwnerTags.push(`<@${CurrentOwnersArray[i]}>`);
                        }
                        let CoOwnerTags = ArrayofCoOwnerTags.toString().replace(/,/g, ' \n')
                        if (CoOwnerTags.length < 1) {
                            client.functions.Reply(msg, `**Current Owner**: <@${ownerid}>`)
                        } else {
                            client.functions.Reply(msg, `**Current Owner**: <@${ownerid}> \n \n**Current Co-Owners:**\n ${CoOwnerTags}`)
                        }
                        
                    }
                })
                d.release(function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            });
            
        } else {
            fn.Reply(msg, config.messages.notinvoice)
        }

    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "owner",
    //aliases: [""],
    description: "Shows who the current Owner and Co-Owners are",
    usage: "owner",
    category: "General",
    maintenancemode: 0
}