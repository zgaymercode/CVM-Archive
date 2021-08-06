const SqlString = module.require('sqlstring');
module.exports.run = async (client, msg, args) => {
    try {

    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "bless",
    //aliases: [""],
    description: "Allows premium members to bless servers",
    usage: "bless add | remove",
    category: "General",
    cooldown: 0,
    maintenancemode: 1
}