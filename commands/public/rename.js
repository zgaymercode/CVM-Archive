const Discord = module.require("discord.js");
module.exports.run = async (client, con, config, msg, args, fn) => {
    try {
        msg.delete();
        if (msg.member.voice.channel) {
            let vc = msg.member.voice.channel;
            let perms = fn.vcOwnerCheck(vc.id, msg.author.id, msg);
            if (perms) {
                let cmd = config.bot.prefix + "rename";
                let text = msg.content.slice(cmd.length);
                vc.setName(text, "Channel Rename Command used by: " + msg.author.id);
                fn.Reply(msg, "Successfully renamed channel")
            } else {
                fn.Reply(msg, config.messages.notowner)
            }
        } else {
            fn.Reply(msg, config.messages.notinvoice)
        }

    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "rename",
    //aliases: [""],
    description: "Renames a channel",
    usage: "",
    category: "General"
}