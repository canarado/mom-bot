exports.run = (client, message, args) => {

    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('Only a server admin may user this command!'.embedify())
    if (message.attachments.size > 0) return message.channel.send('Images can\'t be included in welcome messages...*yet*.'.embedify())

    if(args[0] == 'enable') {

        client.db.get('SELECT welcomechan, welcometext FROM guilds WHERE id=?', [message.guild.id], (err, row) => {
            if(err) {
                console.error(err.message)
            } else if(row == undefined) {
                return message.channel.send('Your guild is not in my database.'.embedify())
            } else if(row.welcomechan == null)  {
                return message.channel.send('Please setup a welcome message, do `<prefix> help welcome` for help with setup.'.embedify())
            } else if(row.welcometext == null) {
                return message.channel.send('Please setup a welcome message, do `<prefix> help welcome` for help with setup.'.embedify())
            } else {
                client.db.run('UPDATE guilds SET welcomeenable=1 WHERE id=?', [message.guild.id], (err) => {
                    if(err) {
                        console.error(err.message)
                    }
                })
                return message.channel.send('Your guild now will have welcome messages.'.embedify())
            }
        })
    } else if(args[0] == 'disable') {
        client.db.run('UPDATE guilds SET welcomeenable=0 WHERE id=?', [message.guild.id], (err) => {
            if(err) {
                console.error(err.message)
            }
        })
        return message.channel.send('Your guild now will have no welcome messages.'.embedify())
    } else {
        let chan = message.mentions.channels.first()
        let welcomemessage = args.slice(1).join(' ')
        if(args.length > 45) return message.channel.send('Try picking a welcome message that is less than 45 words!'.embedify())
        if(welcomemessage.length > 450) return message.channel.send('Try picking a shorter welcome message that is less than 450 characters'.embedify())
        if(!chan) return message.channel.send('Please choose a channel for your welcome messages to be sent in.'.embedify())

        client.db.run('UPDATE guilds SET welcomechan=?, welcometext=?, welcomeenable=1 WHERE id=?', [chan.id, welcomemessage, message.guild.id], (err) => {
            if(err) {
               return console.error(err.message)
            }

            message.channel.send(`Settings have been updated!`.embedify())

        })
    }
}

exports.help = {
    enabled: false,
    hideHelp: true,
    type: "settings",
    name: "welcome",
    description: "The `welcome` command allows you to set a custom message. Use `{{}}` in your message to mention the user on join, and to put channels in your message, put the id of the channel in double brackets, `[[channel id here]]`\nExample: 'Welcome {{}}, please read [[6549519484921321]]. We love you \:\)'",
    usage: "welcome <enable/disable> <mention welcome channel> <message to welcome new users>"
}