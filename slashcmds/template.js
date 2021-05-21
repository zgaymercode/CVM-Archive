module.exports = {
    name: "template",
    description: "This is a template for new slash commands",
    run: async (client, interaction) => {
        try {
            embed = new Discord.MessageEmbed()
                .setColor(client.config.embed.color)
                .setDescription(`EMBEDDD`);
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        tts: false,
                        embeds: [embed],
                        content: `Standard message`
                    }
                }
            })
        } catch (e) {
            console.error(e);
        }
    }
};