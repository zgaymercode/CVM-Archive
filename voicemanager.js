/*
Welcome to Community Voice Manager
Author: WolfTribe Dev Team

                               ,|
                             //|                              ,|
                           //,/                             -~ |
                         // / |                         _-~   /  ,
                       /'/ / /                       _-~   _/_-~ |
                      ( ( / /'                   _ -~     _-~ ,/'
                       \~\/'/|             __--~~__--\ _-~  _/,
               ,,)))))));, \/~-_     __--~~  --~~  __/~  _-~ /
            __))))))))))))));,>/\   /        __--~~  \-~~ _-~
           -\(((((''''(((((((( >~\/     --~~   __--~' _-~ ~|
  --==//////((''  .     `)))))), /     ___---~~  ~~\~~__--~
          ))| @    ;-.     (((((/           __--~~~'~~/
          ( `|    /  )      )))/      ~~~~~__\__---~~__--~~--_
             |   |   |       (/      ---~~~/__-----~~  ,;::'  \         ,
             o_);   ;        /      ----~~/           \,-~~~\  |       /|
                   ;        (      ---~~/         `:::|      |;|      < >
                  |   _      `----~~~~'      /      `:|       \;\_____//
            ______/\/~    |                 /        /         ~------~
          /~;;.____/;;'  /          ___----(   `;;;/
         / //  _;______;'------~~~~~    |;;/\    /
        //  | |                        /  |  \;;,\
       (<_  | ;                      /',/-----'  _>
        \_| ||_                     //~;~~~~~~~~~
            `\_|                   (,~~
                                    \~\
                                     ~~
*/
const Discord = require('discord.js');
const client = new Discord.Client();
client.config = require('./config.js');
const { sep } = require('path');
const mysql = require("mysql");
const { readdirSync } = require("fs");
const SqlString = require("sqlstring");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const disbut = require('discord-buttons');
disbut(client);
client.functions = require('./functions.js');
["commands", "aliases", "slashcmds"].forEach((x) => (client[x] = new Discord.Collection()));
const LoadFiles = async () => {
    const evtFiles = await readdir("./events/");

    evtFiles.forEach((file, i) => {
        const eventName = file.split(".")[0];
        if (eventName === "template") return; // ignore the template file
        const event = require(`./events/${file}`);

        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });

    console.info(`Successfully loaded ${evtFiles.length} events.`);

    let dir2 = "./slashcmds/";
    const cmdFiles = await readdir(dir2);

    cmdFiles.forEach((file2, i) => {
        const cmd = require(`${dir2}${file2}`);
        let name = cmd.name;
        if (name === "template") return;
        if (client.slashcmds.get(name)) {
            console.warn(`Two or more slash commands have the same name: ${name}`);
            return;
        }
        if (typeof name === 'string') {
            client.slashcmds.set(name, cmd)
        } else {
            console.warn(`Error loading file in ${dir2}${file2}. you have a missing name or name is not a string`)
            return;
        }


    });
    let count = Array.from(client.slashcmds.values());
    console.info(`Successfully loaded ${count.length} slash commands.`);
    let dir = "./commands/";
    readdirSync(dir).forEach((dirs) => {
        const commands = readdirSync(`${dir}${sep}${dirs}${sep}`).filter((files) => files.endsWith(".js"));
        for (const file of commands) {
            const pull = require(`${dir}/${dirs}/${file}`);

            if (pull.help && typeof pull.help.name === "string" && typeof pull.help.category === "string") {
                if (client.commands.get(pull.help.name))
                    return console.warn(`Two or more commands have the same name ${pull.help.name}.`);
                client.commands.set(pull.help.name, pull);
            } else {
                console.error(`Error loading command in ${dir}${dirs}${file}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`);
                continue;
            }
            if (pull.help.aliases && typeof pull.help.aliases === "object") {
                pull.help.aliases.forEach((alias) => {
                    if (client.aliases.get(alias))
                        return console.warn(`Two commands or more commands have the same aliases ${alias}`);
                    client.aliases.set(alias, pull.help.name);
                });
            }
        }

    });
    count = Array.from(client.commands.values());
    console.info(`Successfully loaded ${count.length} Commands`);
};
LoadFiles();
client.database = mysql.createPool({
    connectionLimit: 10,
    host: client.config.db.host,
    user: client.config.db.user,
    password: client.config.db.pass,
    database: client.config.db.database,
    charset: "utf8mb4"
});
client.ws.on('INTERACTION_CREATE', async interaction => {
    let cmdname = interaction.data.name;
    if (client.slashcmds.has(cmdname)) client.slashcmds.get(cmdname).run(client, interaction);
    return;
});
client.login(client.config.bot.token).catch(console.error());