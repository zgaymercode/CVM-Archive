/* 
    This file is not used by the bot or the website
    It's simply an internal file for my reference on what
    variables are used, and what their levels are
*/
msg.variables = {
    serverConfig="DB Call from message event. is object {}",
    premiumPerms="DB Call from message event. is object {}",
}
Variables = {
    Control_by_dashboard: {
        joinchanVars: {

        },
        userVars: {
            access: {
                "member": 0,
                "beta-tester": 1,
                "premium_member": 2,
                "Bot Staff": 3,
                "Bot Administrator": 4
            },
        },
        serverVars: {
            premiumBlessed: {
                "not_premium": 0,
                "premium_paid": 1,
                "premium_bypassed": 2,
            }
        }
    },
    Control_by_bot: {
        joinchanVars: {

        },
        userVars: {

        },
        serverVars: {

        }
    }
}