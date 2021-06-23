const SqlString = module.require('sqlstring');

module.exports = async (client, guild) => {
    client.database.getConnection(function (err, d) {
        if (err) { console.error("error connecting: " + err.stack); return; }
        // STORE ID INTO TABLE FOR WEBPANEL TO TRACK WHAT SERVERS THE BOT IS IN
        var sql = SqlString.format('INSERT IGNORE INTO serverids SET sid=?', [guild.id]);
        d.query(sql, (err, res) => {
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