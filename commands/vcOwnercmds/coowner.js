const SqlString = module.require('sqlstring');
async function UpdateDB(client, connect, msg, channel_id, db_insert) {
    let NewDBOwnerObject = `{"coowners": [${db_insert}]}`
    let sql = SqlString.format(`UPDATE channels SET coowner=? where id=?`, [NewDBOwnerObject, channel_id])
    connect.query(sql, (error, results) => {
        if (error || results.length < 1) return client.functions.Reply(msg, `There was an error updating the channel`);
        client.functions.Reply(msg, `Channel's Co-Owner list has successfully been updated.`)
    })
}
module.exports.run = async (client, msg, args) => {
    client.database.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        let cid = msg.member.voice.channel.id;
        let vc = msg.member.voice.channel;
        // First we need to verify that the owner is the one running this command (coowners will by default be able to otherwise)
        var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [cid]);
        d.query(sql, async (er, re) => {
            if (er) console.error(er);
            if (!re.length) return client.functions.Reply(msg, "OOF, a glitch occured. I couldn't find the entry of the voice channel your in, try agin or contact bot support");
            let oid = re[0].oid; // owner id
            let retrieveCoOwnersObj = re[0].coowner;
            let jsonObjectFromDB = JSON.parse(retrieveCoOwnersObj)
            let CurrentOwnersArray = jsonObjectFromDB.coowners || [];
            
            // Now let's lock this command to owner only (non-owner has the owner command that will show the same data)
            if (msg.author.id != oid) return client.functions.reply(msg, `Only the active owner can run this command`);
            ArrayofModifiedCoOwners = [];
            let updateOwnerstatus = msg.mentions.members.first();
            switch (args[0]) {
                case 'list':
                    ArrayofCoOwnerTags = [];
                    for (let i = 0; i < CurrentOwnersArray.length; i++){
                        ArrayofCoOwnerTags.push(`<@${CurrentOwnersArray[i]}>`);
                    }
                    let CoOwnerTags = ArrayofCoOwnerTags.toString().replace(/,/g, ' \n')
                    client.functions.Reply(msg, `**Current Co-Owners:**\n ${CoOwnerTags}`)
                    break;
                case 'add':
                    if (!updateOwnerstatus) return client.functions.Reply(msg, `You must @mention a member to add as a Co-Owner`);
                    for (let i = 0; i < CurrentOwnersArray.length; i++) {
                        ArrayofModifiedCoOwners.push(`"${CurrentOwnersArray[i]}"`);
                    }
                    ArrayofModifiedCoOwners.push(`"${updateOwnerstatus.id}"`);
                    client.functions.AddModLog(client, msg.guild.id, msg.author.id, `Added Co-Owner: <@${updateOwnerstatus.id}>`, vc, '3')
                    UpdateDB(client, d, msg, cid, ArrayofModifiedCoOwners);
                    break;
                case 'remove':
                    if (!updateOwnerstatus) return client.functions.Reply(msg, `You must @mention a member to remove Co-Owner status from`);
                    for (let i = 0; i < CurrentOwnersArray.length; i++) {
                        if (CurrentOwnersArray[i] === updateOwnerstatus.id) continue;
                        ArrayofModifiedCoOwners.push(`"${CurrentOwnersArray[i]}"`);
                    }
                    UpdateDB(client, d, msg, cid, ArrayofModifiedCoOwners);
                    client.functions.AddModLog(client, msg.guild.id, msg.author.id, `Removed Co-Owner: <@${updateOwnerstatus.id}>`, vc, '3')
                    break;
                default:
                    client.functions.Reply(msg, "options are add / remove / list");
            }
            /*  */


        })
        //#endregion
        d.release(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}
module.exports.help = {
    name: "coowner",
    //aliases: [""],
    description: "add/remove/list coowners of a vc",
    usage: "coowner add|remove|list (if add/remove @user here)",
    category: "VC Owner Command",
    maintenancemode: 0
}