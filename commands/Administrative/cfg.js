const SqlString = module.require('sqlstring')
module.exports.run = async (client, msg, args) => {
    try {
        serverDataCheck(client, msg.guild.id, async (server) => {
            let prefix = server.prefix;
            let modlog = server.modlog;
            let adminlog = server.adminlog;

            let option = args[0];
            switch (option) {
                case 'help':
                    // Show help menu of how to use this command
                    break;
                case 'show':
                    db.query(serverdetails / forloop.onJoinChans / forLoop.forbiddonwords);
                    break;
                case 'debug':
                    import(debug.command);
                    break;
                case 'filter':
                    import(blockwords.command);
                    break;
                case 'defaultlock':
                    import(defaultlock.command);
                    break;
                case 'lockable':
                    import(lockable.command);
                    break;
                case 'vcprefix':
                    import(vcprefix.command)
                    break;
                case 'limits':
                    import(limits.command);
                    break;
                case 'prefix':
                    import(prefix.command);
                    break;
                case 'setactivity':
                    import(setactivity.command);
                    break;
                
                default:
                    client.functions.Reply(msg, `Invalid option provided, try ${prefix}config help`)
            }
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports.help = {
    name: "config",
    //aliases: [""],
    description: "TDB",
    usage: "config (TBD)",
    category: "Administrative",
    maintenancemode: 1
}