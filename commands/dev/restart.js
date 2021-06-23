exports.run = (client, msg, args) => {
    if (client.config.bot.isdevbuild === 0) {
        const { exec } = require('child_process');
        exec('../../../autopull.sh', (error, stdout, stderr) => {
            msg.channel.send(`Pulling from GitHub main branch and than Restarting.`).then((m) => {
                setTimeout(() => {
                    m.delete();
                    setTimeout(function () {
                        process.exit(1);
                    }, 100)
                }, 5000);
            });
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    } else {
        msg.channel.send(`Bot is in Dev mode, Pull from github has been canceled. Restarting now`).then((m) => {
            setTimeout(() => {
                m.delete();
                setTimeout(function () {
                    process.exit(1);
                }, 100)
            }, 5000);
        });
    }
    
       
};
module.exports.help = {
    name: "restart",
    //aliases: [""],
    description: "forces a pull from github and restarts the bot, setting all the code to what is on the git repository",
    usage: "restart",
    category: "Dev",
    maintenancemode: 0
}