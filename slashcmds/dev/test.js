module.exports = {
    name: "test",
    description: "Testing new slash command abilities",
    options: [
        {
            "name": "Log Channel",
            "description": "The first submission",
            "type": 3,
            "required": true,
            "choices": [
                {
                    "name": "Admin Log",
                    "value": "admin_log"
                },
                {
                    "name": "Mod Log",
                    "value": "mod_log"
                }
            ]
        }
    ],
    category: "Dev",
    cooldown: 0,
    maintenancemode: 0,
    run: async (client, interaction) => {
        try {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        tts: false,
                        embeds: [],
                        content: `Interaction Received`
                    }
                }
            })
        } catch (e) {
            console.error(e);
        }
    }
};


