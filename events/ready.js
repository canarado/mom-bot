// const Discord = require('discord.js')
const { PlayerManager } = require('discord.js-lavalink')
// const fs = require('fs')
// const cron = require('node-cron')

module.exports = async (client) => {

    console.log(`[SHARD] Shard with ID: ${client.shard.id} readied`)

    await client.wait(2000)
    client.appInfo = await client.fetchApplication()
    setInterval(async () => {
        client.appInfo = await client.fetchApplication()
    }, 60000)

//     client.player = new PlayerManager(client, [
//         {"host":"", "port":, "password":""}
//     ],
//     {
//         user: client.user.id,
//         shards: client.shard.count
//     })
    
    if (client.shard.id == 0) client.user.setActivity('mom help | mombot.canarado.xyz', { type: 'PLAYING' })

    client.shard.broadcastEval(`(async () => {

    this.db.each('SELECT id, todo, time FROM reminders', async (err, row) => {
        if(err) console.error(err);

        let usr = await this.fetchUser(row.id);

        if(!usr) return;

        if(new Date().getTime() > row.time) {
            this.db.run('DELETE FROM reminders WHERE id=? and todo=? and time=?', [row.id, row.todo, row.time], (err2) => {
                if(err2) console.error(err);
            })
        } else {
            let usrc = await this.fetchUser(row.id);

            let messagec = '**Reminder!** ' + row.todo;

            if(usrc) {
                setTimeout(() => {
                    console.log(usrc)
                    usrc.send(messagec.embedify()).catch();
                }, row.time - new Date().getTime())
            }
        }
    })

    })();
    `)
}
