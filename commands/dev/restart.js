const { exec } = module.require('child_process');
exports.run = (client, msg, args) => {
    msg.channel.send(`<:CVM:863021391438675978> Restarting now <:CVM:863021391438675978>`).then((m) => {
        setTimeout(() => {
            m.delete();
            setTimeout(function () {
                process.exit(1);
            }, 100)
        }, 5000);
    });


};
module.exports.help = {
    name: "restart",
    //aliases: [""],
    description: "restarts bot",
    usage: "restart",
    category: "Dev",
    maintenancemode: 0
}