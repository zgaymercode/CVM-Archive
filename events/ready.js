module.exports = async (client) => {
    m = 100; // max intervals before restart
    client.user.setActivity(client.config.bot.startstatus, { type: "PLAYING" });
    client.functions.consolelog(client, m);
    client.functions.ChannelCleanup(client);
    client.functions.JoinchanCleanup(client);
    client.functions.FilterListCleanup(client);
    setInterval(() => {
        client.functions.BotStatus(client);
        client.functions.ChannelCleanup(client);
        client.functions.JoinchanCleanup(client);
        client.functions.FilterListCleanup(client);
        client.functions.consolelog(client, m);
    }, 150000); // every 2.5 minutes
}