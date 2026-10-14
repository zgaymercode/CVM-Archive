module.exports = {
    name: "template",
    description: "This is a template for new slash commands",
    options: [
        {
            "name": "option1",
            "description": "The type of animal",
            "type": 3,
            "required": true,
            "choices": [
                {
                    "name": "Dog",
                    "value": "animal_dog"
                },
                {
                    "name": "Cat",
                    "value": "animal_cat"
                },
                {
                    "name": "Penguin",
                    "value": "animal_penguin"
                }
            ]
        }
    ],
    category: "Administrative",
    cooldown: 0,
    maintenancemode: 0,
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
                        embeds: [],
                        content: `Standard message`
                    }
                }
            })
        } catch (e) {
            console.error(e);
        }
    }
};


