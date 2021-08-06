const SqlString = module.require('sqlstring');
function RemoveCoOwner(client, msg, d, id, vcid, CurrentOwnersArray) {
    ArrayofModifiedCoOwners = [];
    for (let i = 0; i < CurrentOwnersArray.length; i++) {
        if (CurrentOwnersArray[i] === id) continue;
        ArrayofModifiedCoOwners.push(`"${CurrentOwnersArray[i]}"`);
    }
    let NewDBOwnerObject = `{"coowners": [${ArrayofModifiedCoOwners}]}`
    let sql = SqlString.format(`UPDATE channels SET coowner=? where id=?`, [NewDBOwnerObject, vcid])
    d.query(sql, (error, results) => {
        if (error || results.length < 1) return client.functions.Reply(msg, `There was an error updating the channel`);
        client.functions.Reply(msg, `Channel's Co-Owner list has successfully been updated.`)
    })
}
function ChownR(client, msg, d, newownerid, vcid) {
    let newOwnerSQL = SqlString.format(`UPDATE channels SET oid=? WHERE id=?`, [newownerid, vcid]);
    d.query(newOwnerSQL, (newOwnerSQL_error, newOwnerSQL_results) => {
        if (newOwnerSQL_error) console.error(newOwnerSQL_error);
        if (newOwnerSQL_results.length < 1) return;
        if (msg.needsAdminLog === 1) {
            client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `Transfered ownership of ${vcid} to <@${newownerid}>`);
        }
        client.functions.Reply(msg, `Ownership has been transfered to <@${newownerid}>`)
    })
}
module.exports.run = async (client, msg, args) => {
    client.database.getConnection(function (error, d) {
        if (error) console.error(`error Connecting to db: ${error.stack}`);
        let vcid = msg.member.voice.channel.id;
        let DBChanneldata = SqlString.format(`SELECT * FROM channels WHERE id=?`, [vcid]);

        d.query(DBChanneldata, (DBChanneldata_error, DBChanneldata_result) => {
            if (DBChanneldata_error) console.error(DBChanneldata_error);
            if (DBChanneldata_result.length < 1) return client.functions.Reply(msg, `There was a problem finding the config for this channel`);

            let oid = DBChanneldata_result[0].oid;
            let retrieveCoOwnersObj = DBChanneldata_result[0].coowner;
            let jsonObjectFromDB = JSON.parse(retrieveCoOwnersObj)
            let CurrentOwnersArray = jsonObjectFromDB.coowners || [];
            if (!msg.mentions.members.first()) return client.functions.Reply(msg, "You must @mention a member to transfer this channel to");
            let newownerid = msg.mentions.members.first().id;
            if (CurrentOwnersArray.includes(newownerid)) {
                RemoveCoOwner(client, msg, d, newownerid, vcid, CurrentOwnersArray)
            }
            client.functions.ModPermsCheck(msg, (response) => {
                if (!response) {
                    if (msg.author.id === oid) {
                        ChownR(client, msg, d, newownerid, vcid)
                    } else {
                        client.functions.Reply(msg, client.config.messages.notowner)
                    }
                } else {
                    ChownR(client, msg, d, newownerid, vcid)
                }
            })

        })
        d.release(function (error) { if (er) console.error(er) });
    })
}
module.exports.help = {
    name: "transfer",
    //aliases: [""],
    description: "transfers ownership to the @mentioned user",
    usage: "transfer @member",
    category: "VC Owner Command",
    cooldown: 0,
    maintenancemode: 0
}