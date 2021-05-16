module.exports = {
    bot: {
        cmds_enabled: 1,
        prefix: "cv",
        startstatus: /* PLAYING */ "cvhelp for help!",
        token: "TOKEN_HERE"
    },
    messages: {
        notowner: "Sorry, this command can only be ran by the owner of the channel. if the owner left, you can use the claim command to claim it",
        disablemessage: "Sorry, but this bot is still being built, Please contact <@827007664529342505> if you're intereseted in using this bot",
        notinvoice: "You are not in a voice channel",
        nomanager: "You must either have Manage Server or Administrator to use this command",
        ownerstillpresent: "You can not claim a voice channel while the owner is still in the room",
        oof: "Something happend, please try again",
    },
    db: {
        host: "HOST_ADDRESS",
        user: "USERNAME",
        pass: "PASSWORD",
        database: "vcbot"
    },
    embed: {
        ver: "0.1",
        footer: "Bot created by the WolfTribe",
        color: '#1F85DE'
    },
    server: {
        memberrole: "843537697426505798", // use if server config has @everyone locked to see chan's
    },
    staff: [
        "USER_ID_FORDEV" // this is the developer for when commands are disabled
    ]
}
