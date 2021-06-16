const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring')
async function updateStage(client, msg, jcid, newval) {
    client.database.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        var sql = SqlString.format('SELECT * FROM joinchans WHERE joinchan=?', [jcid]);
        d.query(sql, async (er1, re1) => {
            if (er1) return client.functions.Reply(msg, "There was a glitch in the matrix, please contact bot support :3");
            if (!re1.length) return client.functions.Reply(msg, `Could not find ${jcid} in the cache of join channels. if this is an error, contact bot support`);
            let sql1 = SqlString.format(`UPDATE joinchans SET is_stage = ? WHERE joinchan=?`, [newval, jcid]);
            d.query(sql1, async (er2, re2) => {
                if (er2) return client.functions.Reply(msg, "There was a glitch in the matrix, please contact bot support :3");
                if (!re2) return client.functions.Reply(msg, `There was an error updating that channel, please contact bot support`)
                client.functions.Reply(msg, `Successfully updated <#${jcid}>`);
            })
        })        
        d.release(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
        let jcid = args[1];
        switch (args[0]) {
            case "true":
                if (isNaN(jcid)) return client.functions.Reply(msg, "supplied join channel id is not numeric");
                updateStage(client, msg, jcid, 1);
                break;
            case 'false':
                if (isNaN(jcid)) return client.functions.Reply(msg, "supplied join channel id is not numeric");
                updateStage(client, msg, jcid, 0);
                break;
            default:
                client.functions.Reply(msg, "You must select true or false as the first argument");
                break;
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "setactivity",
    //aliases: [""],
    description: "Sets a joinchannel to be a stage like vc (not an actual discord stage)",
    usage: "setactivity true <join_channel_id>",
    category: "Administrative",
    maintenancemode: 1
}