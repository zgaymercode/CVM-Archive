const SqlString = module.require('sqlstring');
module.exports = async (client, guild) => {
    console.log("Bot has left: " + guild.id);
    client.functions.ChannelCleanup(client);
    client.functions.JoinchanCleanup(client);
    client.database.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        // YEET all the server's forbiddonwords words
        var sql = SqlString.format('DELETE FROM forbiddonwords WHERE gid=?', [guild.id]);
        d.query(sql, (err, res) => {
            if (err) console.error(err);
        })
        // Delete the server's config (if it exists)
        var sql2 = SqlString.format(`DELETE FROM serverconfig WHERE id=?`, [guild.id]);
        d.query(sql2, (err, res) => {
            if (err) console.error(err);
        })
        d.release(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}