module.exports = async (client) => {
    // all intervals are ran via functions.js
    client.user.setActivity(client.config.bot.startstatus, { type: "PLAYING" });
    client.functions.intervals(client);
}