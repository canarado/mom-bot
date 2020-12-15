const Discord = require('discord.js')

exports.run = (client, message, args) => {
    let personat = message.mentions.users.first() ? message.mentions.users.first().id : message.author.id

    client.db.serialize(() => {
        client.db.get('SELECT treats FROM users WHERE id=?', [personat], (err, row) => {
            if(err) {
                console.error(err.message)
            } else
            if(row == undefined) {
                return message.channel.send('no data found for this user!'.embedify())
            } else {
                if(personat == message.author.id) {
                    let embed = new Discord.RichEmbed()
                    .setTitle(`${message.author.username}'s treats`)
                    .setColor(client.config.embedColor)
                    .setDescription(`${message.author.username} has ${row.treats.toLocaleString()} treats!`)

                    return message.channel.send(embed)
                } else {
                    let embed = new Discord.RichEmbed()
                    .setTitle(`${message.mentions.users.first().username}'s treats`)
                    .setColor(client.config.embedColor)
                    .setDescription(`${message.mentions.users.first().username} has ${row.treats.toLocaleString()} treats!`)

                    return message.channel.send(embed)
                }
            }
        })
    })
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "economy",
    name: "treats",
    aliases: ['points', 'money', 'wallet', 'balance'],
    description: "The `treats` command displays a users treats, mom's premium currency!",
    usage: "treats <optional mention to get another users treats balance>"
}