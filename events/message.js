const SqlString = module.require('sqlstring')
module.exports = async (client, msg) => {
    let fn = client.functions;
    let config = client.config;
    let con = client.database;
    if (msg.author.bot || !msg.guild || msg.webhookID) return;
    // handle the command arguments and schtuffs
    let prefix = config.bot.prefix;
    if (!msg.content.startsWith(prefix)) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    let command;

    if (!msg.member) msg.member = msg.guild.fetchMember(msg.author);
    if (cmd.length === 0) return;
    if (client.commands.has(cmd)) command = client.commands.get(cmd);
    else if (client.aliases.has(cmd)) command = client.commands.get(client.aliases.get(cmd));
    if (!command) return;
    // handle the command
    msg.delete().catch(() => { return; })
    if (config.bot.cmds_enabled === 0) {
        // user needs to be a part of bot staff for commands to run
        if (config.staff.includes(msg.author.id)) {
            command.run(client, msg, args);
            return;
        } else {
            fn.Reply(msg, config.messages.disablemessage);
            return;
        }
    } else {
        if (command.help.maintenancemode === 1) {
            if (config.staff.includes(msg.author.id)) {
                command.run(client, msg, args);
                return;
            } else {
                fn.Reply(msg, "Sorry, This command is under Maintenance")
                return;
            }
        }
        switch (command.help.category) {
            case "Dev":
                if (!config.staff.includes(msg.author.id)) return fn.Reply(msg, "Sorry, This is a Dev Command");
                command.run(client, msg, args);
                break;
            case "Administrative":
                if (!msg.member.hasPermission("MANAGE_GUILD") && !msg.member.hasPermission("ADMINISTRATOR")) return fn.Reply(msg, config.messages.nomanager);
                command.run(client, msg, args);
                break;
            case "VC Owner Command":
                if (!msg.member.voice.channel) return fn.Reply(msg, "You are not in a voice chat");
                let vcid = msg.member.voice.channel.id;
                let uid = msg.author.id
                var sql = SqlString.format('SELECT * FROM channels WHERE id=?', [vcid]);
                client.database.getConnection(function (err, d) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    d.query(sql, async (er, re) => {
                        if (er) console.error(er);
                        if (re.length > 0) {
                            let owner = re[0].oid;
                            if (msg.member.hasPermission("MOVE_MEMBERS") || msg.member.hasPermission("ADMINISTRATOR")) {
                                command.run(client, msg, args);
                            } else if (uid === owner) {
                                command.run(client, msg, args);
                            } else {
                                fn.Reply(msg, config.messages.notowner)
                            }

                        }

                    })

                    d.release(function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                });
                break;
            default:
                command.run(client, msg, args);
                break;
        }
    }
}