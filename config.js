module.exports = {
    bot: {
        cmds_enabled: 1,
        isdevbuild: 1,
        renamecooldown: 5, // minutes
        ownerleavecooldown: 3, // minutes
        prefix: "cv",
        startstatus: /* PLAYING */ "cvhelp for help!",
        giturl: "https://cvm.wolftribe.dev/",
        token: "TOKEN_HERE"
    },
    tmp: {
        var: "",
        array: []
    },
    messages: {
        notowner: "Sorry, this command can only be ran by the owner of the channel. if the owner left, you can use the claim command to claim it",
        disablemessage: "Sorry, but at this moment, commands are disabled for maitenance. Please contact bot staff for more info",
        notinvoice: "You are not in a temporary voice channel",
        nomanager: "You must either have Manage Server or Administrator to use this command",
        ownerstillpresent: "You can not claim a voice channel while the owner is still in the room",
        oof: "Something happend, please try again",
        admindisabled: "Sorry, that command has been disabled in this server",
        channeldisabled: "Sorry, you are not permitted to run that command in this channel"
    },
    db: {
        host: "HOST_ADDRESS",
        host2: "HOST_ADDRESS",
        user: "USERNAME",
        pass: "PASSWORD",
        database: "DATABASENAME",
        database2: "DATABASENAME"
    },
    embed: {
        ver: "v0.8.8 [Dev-Build]",
        footer: "Bot created by the WolfTribe",
        color: '#1F85DE'
    },
    staff: [
        "USER_ID_FORDEV"
    ],
    perms: { // Just a guide for all available perms :P
        CREATE_INSTANT_INVITE: '',
        KICK_MEMBERS: '',
        BAN_MEMBERS: '',
        ADMINISTRATOR: '',
        MANAGE_CHANNELS: '',
        MANAGE_GUILD: '',
        ADD_REACTIONS: '',
        VIEW_AUDIT_LOG: '',
        PRIORITY_SPEAKER: '',
        STREAM: '',
        VIEW_CHANNEL: '',
        SEND_MESSAGES: '',
        SEND_TTS_MESSAGES: '',
        MANAGE_MESSAGES: '',
        EMBED_LINKS: '',
        ATTACH_FILES: '',
        READ_MESSAGE_HISTORY: '',
        MENTION_EVERYONE: '',
        USE_EXTERNAL_EMOJIS: '',
        VIEW_GUILD_INSIGHTS: '',
        CONNECT: '',
        SPEAK: '',
        MUTE_MEMBERS: '',
        DEAFEN_MEMBERS: '',
        MOVE_MEMBERS: '',
        USE_VAD: '',
        CHANGE_NICKNAME: '',
        MANAGE_NICKNAMES: '',
        MANAGE_ROLES: '',
        MANAGE_WEBHOOKS: '',
        MANAGE_EMOJIS: ''
    }
}
