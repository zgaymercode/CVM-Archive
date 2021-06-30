const SqlString = module.require('sqlstring')
module.exports = async (client, msg) => {
    if (msg.author.bot || !msg.guild || msg.webhookID) return;
    // Get the server's data to see which server and what it's config is
    client.functions.serverDataCheck(client, msg.guild.id, (serverConfig) => {
        // handle the command arguments and schtuffs
        let prefix = serverConfig.prefix;
        if (msg.content === `<@!${client.user.id}>`) {
            client.functions.Reply(msg, `My current prefix is: ${prefix}`)
        }
        if (!msg.content.toLowerCase().startsWith(prefix)) return;
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
        if (client.config.bot.cmds_enabled === 0) {
            // user needs to be a part of bot staff for commands to run
            if (client.config.staff.includes(msg.author.id)) {
                command.run(client, msg, args);
                return;
            } else {
                client.functions.Reply(msg, client.config.messages.disablemessage);
                return;
            }
        } else {
            if (command.help.maintenancemode === 1) {
                if (client.config.staff.includes(msg.author.id)) {
                    command.run(client, msg, args);
                    return;
                } else {
                    client.functions.Reply(msg, "Sorry, This command is under Maintenance")
                    return;
                }
            }

            switch (command.help.category) {
                case "Dev":
                    if (!client.config.staff.includes(msg.author.id)) return client.functions.Reply(msg, "Sorry, This is a Dev Command");
                    command.run(client, msg, args);
                    break;
                case "Administrative":
                    if (!msg.member.hasPermission("MANAGE_GUILD") && !msg.member.hasPermission("ADMINISTRATOR")) return client.functions.Reply(msg, client.config.messages.nomanager);
                    command.run(client, msg, args);
                    break;
                case "VC Owner Command":
                    client.functions.isTmpVC(client, msg, (callback) => {
                        if (!callback) return;
                        client.functions.vcPermsCheck(client, msg, (response) => {
                            if (!response) return client.functions.Reply(msg, client.config.messages.notowner);
                            switch (command.help.name) {
                                case 'kick':
                                    if (serverConfig.kick === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                    command.run(client, msg, args);
                                    break;
                                case 'transfer':
                                    if (serverConfig.transfer === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                    command.run(client, msg, args);
                                    break;
                                case 'coowner':
                                    if (serverConfig.coowner === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                    command.run(client, msg, args);
                                    break;
                                case 'invite':
                                    if (serverConfig.invite === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                    command.run(client, msg, args);
                                    break;
                                case 'limit':
                                    if (serverConfig.limit === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                    command.run(client, msg, args);
                                    break;
                                case 'partyadd':
                                    if (serverConfig.partyadd === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                    command.run(client, msg, args);
                                    break;
                                case 'partyclear':
                                    if (serverConfig.partyclear === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                    command.run(client, msg, args);
                                    break;
                                case 'partyremove':
                                    if (serverConfig.partyremove === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                    command.run(client, msg, args);
                                    break;
                                case 'lock':
                                    if (serverConfig.lock === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                    command.run(client, msg, args);
                                    break;
                                case 'unlock':
                                    if (serverConfig.unlock === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                    command.run(client, msg, args);
                                    break;
                                case 'queue':
                                    if (serverConfig.queue === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                                    command.run(client, msg, args);
                                    break;
                                default:
                                    command.run(client, msg, args);
                                    break;
                            }
                        })
                    })

                    break;
                default:
                    switch (command.help.name) {
                        case 'owner':
                            if (serverConfig.owner === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                            command.run(client, msg, args);
                            break;
                        case 'claim':
                            if (serverConfig.claim === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                            command.run(client, msg, args);
                            break;
                        case 'hand':
                            if (serverConfig.hand === 0) return client.functions.Reply(msg, client.config.messages.admindisabled);
                            command.run(client, msg, args);
                            break;
                        default:
                            command.run(client, msg, args);
                            break;
                    }
            }
        }
    })
}