function formatSeconds(seconds) {
    let date = new Date(1970,0,1)
    date.setSeconds(seconds)
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
}

exports.run = (client, message, args) => {

    let d = new Date()

    let now = Math.round(d.getTime() / 1000)

    let dailyamt = Math.floor( Math.random() * (200 + 1 - 50) + 50 )

    client.db.get('SELECT daily FROM users WHERE id=?', [message.author.id], (err, row) => {
        if(err) {
            console.error(err.message)
        } else if(row == undefined) {
            return message.channel.send('Something went wrong, it appears you aren\'t in my system...'.embedify())
        } else {
            if(now - row.daily < 86400) {
                return message.channel.send(`You can not claim your daily yet! Try again in \`${formatSeconds(row.daily - now).replace(/:/, 'h').replace(/:/, 'm')}s.\``.embedify())
            } else {
                client.db.run('UPDATE users SET treats=treats+?, daily=? WHERE id=?', [dailyamt, now, message.author.id], (err3) => {
                    if(err3) {
                        console.error(err.message)
                    } else {
                        message.channel.send(`You got \`${dailyamt}\` treats!`.embedify())
                    }
                })
            }
        }
    })
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "economy",
    name: "daily",
    description: "The `daily` command gives you a daily treat bonus.",
    usage: "daily"
}