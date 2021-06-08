const Discord = module.require("discord.js");
const SqlString = module.require('sqlstring')
async function updateStage(d, catid, newval) {
    
}
module.exports.run = async (client, msg, args) => {
    let con = client.database;
    let config = client.config;
    let fn = client.functions;
    try {
        switch (args[0]) {
            case "true":
                
                break;
            case 'false':
                
                break;
        }
    }
    catch (error) {
        console.log(error)
    }

}
module.exports.help = {
    name: "setstage",
    //aliases: [""],
    description: "Sets a joinchannel to be a stage like vc (not an actual discord stage)",
    usage: "setstage true <cat_id>",
    category: "Administrative",
    maintenancemode: 1
}