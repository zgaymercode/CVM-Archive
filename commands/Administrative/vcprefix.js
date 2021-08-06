const SqlString = module.require('sqlstring')
async function UpdateChanPrefix(client, msg, new_prefix, joinchanid) {
    client.database.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        var UpdateSqlString = SqlString.format('UPDATE joinchans SET prefix=? WHERE joinchan=?', [new_prefix, joinchanid
        ]);
        d.query(UpdateSqlString, async (ErrorUpdate, Results_Update) => {
            if (ErrorUpdate) console.error(ErrorUpdate);
            if (!Results_Update) return;
            if (Results_Update) {
                client.functions.Reply(msg, `Prefix Successfully Updated to ${new_prefix}`);
                client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `set <#${joinchanid}>'s prefix to '${new_prefix}'`);
            }
        })
        d.release(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}
module.exports.run = async (client, msg, args) => {
    switch (args[0]) {
        case 'set':
            joinchanid = args[1];
            if (isNaN(joinchanid)) return client.functions.Reply(msg, `You must supply a valid join channel id`);
            console.log(args);
            prep = args.toString().replace(joinchanid + ",", '').replace('set,', '');
            new_prefix = prep.replace(/,/g, ' ');
            UpdateChanPrefix(client, msg, new_prefix, joinchanid)
            break;
        case 'reset':
            joinchanid = args[1];
            if (isNaN(joinchanid)) return client.functions.Reply(msg, `You must supply a valid join channel id`);
            UpdateChanPrefix(client, msg, null, joinchanid)
            break;
        default:
            client.functions.Reply(msg, "You need to supply either set or reset for this to work :3");
            break;
    }
    /* */
}
module.exports.help = {
    name: "vcprefix",
    aliases: ["vcp"],
    description: "Updates the Channel's prefix. if you wish to reset the value to null, you can do reset <join_channel_id> instead",
    usage: "vcprefix set <join_channel_id> <new_prefix>  OR reset <join_channel_id>",
    category: "Administrative",
    cooldown: 0,
    maintenancemode: 0
}