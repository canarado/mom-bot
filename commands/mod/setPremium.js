exports.run = (client, message, args) => {

    if(client.checkIfDeveloper(message.author.id)) return

    let id = args[0] ? args[0] : message.guild.id

    client.db.get('SELECT premium FROM music WHERE id=?', [message.guild.id], (err1, row) => {
        if(err1) console.error(err1)
        if(row == undefined) return message.channel.send('That server does not exist in my database, try again later.'.embedify())

        client.db.run('UPDATE music SET premium=? WHERE id=?', [row.premium == 'true' ? 'false' : 'true', message.guild.id], (err2) => {
            if(err2) console.error(err2)

            return message.channel.send(`This server's premium status has been updated to ${row.premium == 'true' ? 'false' : 'true'}!`.embedify())
        })
    })
}

exports.help = {
    enabled: true,
    hideHelp: true,
    type: "mod",
    name: "snipe",
    description: "[CENSORED]",
    usage: "setPremium"
}