const Discord = module.require('discord.js')
const SqlString = module.require('sqlstring')
const { MessageButton, MessageActionRow } = require("discord-buttons");
const { fn } = require("moment");
module.exports.run = async (client, msg, args) => {
    // Define the reactions (if you modify these, modify them in the messageReactionAdd event as well)
    try {
        let vcid = msg.member.voice.channel.id;
        var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [vcid]);
        client.database.getConnection(function (err, d) {
            if (err) {
                console.error("error connecting: " + err.stack);
                return;
            }
            client.functions.isTmpVC(client, msg, (istmpvc) => {
                if (!istmpvc) return;
                client.functions.isActivityVC(client, msg, (isActivityVC) => {
                    if (!isActivityVC) return;
                    switch (args[0]) {
                        case 'lower':
                            // let's see if the requests still have messages attached to them, and if they do, YEET
                            let queueVerify = SqlString.format(`SELECT * FROM queue WHERE userid=?`, [msg.author.id]);
                            d.query(queueVerify, (queueVerify_error, queueVerify_results) => {
                                if (queueVerify_error) console.error(queueVerify_error);
                                if (queueVerify_results.length > 0) {
                                    // delete the queue entry (entries, if there's more than one)
                                    let yeetQueueRequest = SqlString.format(`DELETE FROM queue WHERE userid=?`, [msg.author.id]);
                                    d.query(yeetQueueRequest, (yeetQueueRequest_error, yeetQueueRequest_results) => {
                                        if (yeetQueueRequest_error) console.error(yeetQueueRequest_error);
                                        client.functions.Reply(msg, `Succesfully removed you from the queue`);
                                    })
                                } else {
                                    client.functions.Reply(msg, `You are not currently in the queue`)
                                }
                            })
                            break;
                        case 'raise':
                            // Create the embed to make life look PWETTY :3 
                            let embed = new Discord.MessageEmbed()
                                .setColor(client.config.embed.color)
                                .setTimestamp()
                                .setTitle(`Request to Speak recieved`)
                                .setDescription(`<@${msg.author.id}> has requested to speak.`)
                            msg.channel.send(embed)


                            let userid = msg.author.id;
                            let CreateQueueSQL = SqlString.format(`INSERT IGNORE INTO queue SET userid=?, vcid=?, created=CURRENT_TIMESTAMP()`, [userid, vcid]);
                            d.query(CreateQueueSQL, (CreateQueueSQL_error, CreateQueueSQL_results) => {
                                if (CreateQueueSQL_error) console.error(CreateQueueSQL_error);
                            })
                            break;
                        case 'status':
                            let queueCheckSQL = SqlString.format(`SELECT * FROM queue WHERE vcid=? ORDER BY created ASC`, [vcid]);
                            d.query(queueCheckSQL, (queueCheckSQL_error, queueCheckSQL_results) => {
                                if (queueCheckSQL_error) console.error(queueCheckSQL_error);
                                if (queueCheckSQL_results.length > 0) {
                                    let tmp = [];
                                    for (let i = 0; i < queueCheckSQL_results.length; i++){
                                        let userid = queueCheckSQL_results[i].userid;
                                        let created = queueCheckSQL_results[i].created;

                                        let requested = client.functions.timesince(created);
                                        tmp.push(`${i + 1} : <@${userid}>  Requested: ${requested} minutes ago\n`)
                                    }
                                    let mesg = tmp.toString().replace(/,/g, '');
                                    client.functions.Reply(msg, `**This server's Current Queue** \n ${mesg}`)
                                } else {
                                    client.functions.Reply(msg, `Could not find anything in this channel's queue`)
                                }
                            })
                            break;
                        default:
                            client.functions.Reply(msg, `Invalid Input provided. valid options are raise/lower/queue   try the help command if you need more assistance`)
                    }
                })
            })
            d.release(function (err) {
                if (err) {
                    console.error(err);
                }
            });
        });


    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "hand",
    //aliases: [""],
    description: 'allows you to add/remove yourself from the queue, also allows you to check the queue of speakers',
    usage: "hand raise | lower | status",
    category: "General",
    maintenancemode: 1
}