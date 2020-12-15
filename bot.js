require('dotenv').config()

const Discord = require('discord.js')
const fs = require('fs')
const klaw = require('klaw')
const path = require('path')
const sqlite = require('sqlite3')
const client = new Discord.Client({
    disableEveryone: true,
    disabledEvents: ['TYPING_START', 'GUILD_INTEGRATIONS_UPDATE', 'USER_NOTE_UPDATE', 'USER_SETTINGS_UPDATE', 'GUILD_MEMBER_ADD', 'CHANNEL_PINS_UPDATE', 'GUILD_BAN_ADD', 'GUILD_BAN_REMOVE', 'PRESENCE_UPDATE']
})

client.config = require('./config.json')
client.commands = new Map()
client.aliases = new Map()
client.db = new sqlite.Database('./db/mom.db', err => {
    if(err) console.error(err.message)
})
client.msgcooldown = new Set()
require('./utils.js')(client)
client.queue = new Map()
client.snipeMap = new Map()
client.slotSet = new Set()
client.cooldowns = new Map()

const start = async () => {
    fs.readdir("./events/", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            const event = require(`./events/${file}`);
            let eventName = file.split(".")[0];
            client.on(eventName, event.bind(null, client));
        });
    });

    klaw("./commands").on("data", (item) => {
        const cmdFile = path.parse(item.path);
        if (!cmdFile.ext || cmdFile.ext !== ".js") return;
        try {
            let props = require(`${cmdFile.dir}${path.sep}${cmdFile.name}${cmdFile.ext}`)
            // console.log(`Loading Command: ${props.help.name}`)
            client.commands.set(props.help.name, props)
            if (props.help.aliases) props.help.aliases.forEach(alias => {
                client.aliases.set(alias, props)
            });
        } catch (e) {
            return console.log(new Error(`FAIL: ${cmdFile.name}: ${e.stack}`))
        };
    });
    // console.log('I am prepared to decimate them weebs with my otaku-desu status ÒwÓ')

    client.login(process.env.BOT_TOKEN)
}

start()