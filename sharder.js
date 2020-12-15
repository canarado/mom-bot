require('dotenv').config()

const { ShardingManager } = require('discord.js')
const sqlite = require('sqlite3')
const manager = new ShardingManager('./bot.js', {
    token: process.env.BOT_TOKEN
})

manager.spawn()
manager.on('launch', shard => {
    console.log(`[SHARD] Shard with ID: ${shard.id} successfully launched`)
})

let db = new sqlite.Database('./db/mom.db', err => {
    if(err) console.error(err.message)
    // console.log('Connection to database was successful...')
})

let queries = [
    "users (id TEXT PRIMARY KEY NOT NULL, username TEXT NOT NULL, treats INT NOT NULL, xp INT NOT NULL, daily INT, work INT)",
    "guilds (id TEXT PRIMARY KEY NOT NULL, guildname TEXT NOT NULL, gprefix TEXT NOT NULL, welcomechan TEXT, welcomeenable INT NOT NULL, welcometext TEXT, starboard TEXT, starboardAdmin TEXT)",
    "useritems(userid TEXT NOT NULL, itemid TEXT NOT NULL)",
    "music(id TEXT PRIMARY KEY NOT NULL, premium TEXT NOT NULL, djonly TEXT NOT NULL, djroles TEXT NOT NULL)",
    "stats(usercount INT NOT NULL, servercount INT NOT NULL, ram TEXT NOT NULL, cpu TEXT NOT NULL)",
    "reminders(id TEXT, todo TEXT NOT NULL, time INT NOT NULL)",
    "blacklist(id TEXT, cmds TEXT)"
]

queries.forEach(query => db.run(`CREATE TABLE IF NOT EXISTS ${query}`))