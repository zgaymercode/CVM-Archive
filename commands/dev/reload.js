const { readdirSync } = require("fs");
const { join } = require("path");
module.exports.run = (client, msg, args) => {
	if (!args[0]) return msg.channel.send("Please provide a command to reload!");
	const commandName = args[0].toLowerCase();
	const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
	if (!command) return msg.channel.send("That command doesn't exist. Try again.");
	readdirSync(join(__dirname, "..")).forEach(f => {
		const files = readdirSync(join(__dirname, "..", f));
		if (files.includes(`${commandName}.js`)) {
			const file = `../${f}/${commandName}.js`;
			try {
				delete require.cache[require.resolve(file)];
				client.commands.delete(commandName);
				const pull = require(file);
				client.commands.set(commandName, pull);
				return msg.channel.send(`Successfully reloaded command: ${commandName}`);
			}
			catch (err) {
				msg.channel.send(`Could not reload: ${args[0].toUpperCase()}\``);
				return console.log(err.stack || err);
			}
		}
	});
}
module.exports.help = {
	name: "reload",
	//aliases: [""],
	description: "reloads the specified command",
	usage: "reload <commandname>",
	category: "Dev",
	maintenancemode: 1
};