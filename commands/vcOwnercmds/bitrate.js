function setBitrate(client, msg) {
    let serverTier = msg.guild.premiumTier;
    let vc = msg.member.voice.channel;
    switch (serverTier) {
        case 1:
            bitrateMax = 128000;
            break;
        case 2:
            bitrateMax = 256000;
            break;
        case 3:
            bitrateMax = 384000;
            break;
        default:
            bitrateMax = 64000;
    }

    let bitrate = msg.newBitrate / 1000;
    let max = bitrateMax / 1000;

    if (bitrate > max) return client.functions.Reply(msg, `coult not set bitrate to ${bitrate}kbps, due to your server's boost level, max bitrate is ${max}kbps`);
    if (bitrate < 8) return client.functions.Reply(msg, `coult not set bitrate to ${bitrate}kbps, minimum is 8kbps`);
    vc.setBitrate(msg.newBitrate)
        .then(() => {
            if (msg.needsAdminLog === 1) {
                client.functions.AddAdminLog(client, msg.guild.id, msg.author.id, `${msg.author} adjusted bitrate to ${bitrate}kbps`)
            }
            client.functions.Reply(msg, `Successfully set bitrate to ${bitrate}kbps`);
            client.functions.AddModLog(client, msg.guild.id, msg.author.id, `${msg.author} adjusted bitrate to ${bitrate}kbps`, vc, 2)
        })
        .catch((e) => {
            console.log(e)
            client.functions.Reply(msg, `Could not set bitrate to ${bitrate}kbps, Try again, or contact bot support`);
        })
}

const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    let input = args[0];
    if (!input) return client.functions.Reply(msg, `You must proved a Numeric argument to adjust the bitrate of the current voice channel`);
    if (isNaN(input)) return client.functions.Reply(msg, `Invalid bitrate, Must be Numeric`);
    msg.newBitrate = input * 1000;
    setBitrate(client, msg)
}
module.exports.help = {
    name: "bitrate",
    //aliases: [""],
    description: "sets the bitrate of a channel",
    usage: "bitrate 64",
    category: "VC Owner Command",
    cooldown: 0,
    maintenancemode: 1
}