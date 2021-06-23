const SqlString = module.require('sqlstring');

module.exports = async (client, guild) => {
    let fn = client.functions;
    let config = client.config;
    let con = client.database;
    console.log("Bot has left: " + guild.id);
    fn.ChannelCleanup(client);
    fn.JoinchanCleanup(client);
    con.getConnection(function (err, d) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        //#region YEET all the server's blacklisted words
        var sql = SqlString.format('DELETE FROM blacklistedwords WHERE gid=?', [guild.id]);
        d.query(sql, (err, res) => {
            if (err) console.error(err);
        })
        // REMOVE ID FROM TABLE FOR WEBPANEL TO TRACK WHAT SERVERS THE BOT IS IN
        var sql2 = SqlString.format('DELETE FROM serverids SET sid=?', [guild.id])
        d.query(sql2, (err, res) => {
            if (err) console.error(err);
        })
        //#endregion
        d.release(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}