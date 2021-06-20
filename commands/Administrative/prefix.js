const Discord = module.require('discord.js');
const SqlString = module.require(`sqlstring`);
async function UpdatePrefix(client, msg, new_Prefix, gid) {
    client.database.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        let UpdatePrefix = SqlString.format(`UPDATE servers SET prefix=? WHERE id=?`, [new_Prefix, gid]);
        d.query(UpdatePrefix, (error, result) => {
            if (error) return console.error(error);
            if (!result) return client.functions.Reply(msg, "Could not update Prefix");
            if (result) return client.functions.Reply(msg, `Successfully set prefix to ${new_Prefix}`);
        })
        d.release(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}
exports.run = async (client, msg, args) => {
    switch (args[0]) {
        case 'set':
            let new_prefix1 = args[1];
            UpdatePrefix(client, msg, new_prefix1, msg.guild.id);
            break;
        case 'reset':
            let new_Prefix = client.config.bot.prefix;
            UpdatePrefix(client, msg, new_Prefix, msg.guild.id);
            break;
        default:
            client.functions.Reply(msg, `available options are set <new_prefix> or reset`);
            break;
    }
};
module.exports.help = {
    name: "prefix",
    //aliases: [""],
    description: "sets this server's prefix or reset's prefix to base prefix",
    usage: "prefix set <newprefix> OR reset",
    category: "Administrative",
    maintenancemode: 0
}