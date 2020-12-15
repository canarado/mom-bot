exports.run = (client, message, args, p) => {

    if(!message.member.hasPermission('MANAGE_GUILD', false, true, true)) return message.channel.send(`You do not have permissions to change these settings. Please ask a server admin to change them.`.embedify())
    if(!args[0]) return message.channel.send(`Please give me a valid command to blacklist! View  a list of commands with \`${p} blacklist list\``.embedify())

    if(args[0] == 'list') {
        let commands = client.config.validCommands.map(x => `\`${x}\``).join(' ')

        return message.channel.send(commands.embedify().setTitle('Valid Commands to Add to Your Server\'s Blacklist'))
    }  else if(args[0] == 'show') {
        client.db.get('SELECT cmds FROM blacklist WHERE id=?', [message.guild.id], (err, row) => {
            if(err) console.error(err.message)
            if(row == undefined || !row.cmds) return message.channel.send('You have no commands blacklist for me to show.'.embedify())
            let commandString = row.cmds.rowToArray().map(x => `\`${x}\``).join(' ')

            message.channel.send(commandString.embedify().setTitle('Blacklisted Commands for Current Guild'))
        })
    } else if(args[0] == 'remove') {
        let commandToRemove = args[1]

        if(client.aliases.has(commandToRemove)) commandToRemove = client.aliases.get(commandToRemove).help.name

        if(client.config.validCommands.includes(commandToRemove)) {
            client.db.get('SELECT cmds FROM blacklist WHERE id=?', [message.guild.id], (err, row) => {
                if(err) console.error(err.message)
                if(row == undefined) {
                    return message.channel.send('You have no blacklisted commands for me to remove.'.embedify())
                } else {
                    let scmds = row.cmds.rowToArray()

                    let newBlacklist = scmds.filter(x => x != commandToRemove)

                    client.db.run('UPDATE blacklist SET cmds=? WHERE id=?', [newBlacklist.join(','), message.guild.id], (err) => { if(err) console.error(err.message) })

                    return message.channel.send(`Updated blacklist.`.embedify())
                }
            })
        } else {
            return message.channel.send(`That is not a valid command to remove from the blacklist. Please try again.`.embedify())
        }
    } else {
        let commandToBlacklist = args[0]

        if(client.aliases.has(commandToBlacklist)) commandToBlacklist = client.aliases.get(commandToBlacklist).help.name

        if(client.config.validCommands.includes(commandToBlacklist)) {

            client.db.get('SELECT cmds FROM blacklist WHERE id=?', [message.guild.id], (err, row) => {
                if(err) console.error(err.message)
                if(row == undefined) {

                    client.db.run('INSERT INTO blacklist(id, cmds) VALUES(?, ?)', [message.guild.id, commandToBlacklist], (err) => {
                        if(err) console.error(err.message)
                    })

                    return message.channel.send(`Updated blacklist.`.embedify())
                } else {

                    let tcmds = row.cmds.rowToArray().filter(x => x != '')

                    tcmds.push(commandToBlacklist)

                    tcmds = tcmds.join(',')
                    client.db.run('UPDATE blacklist SET cmds=? WHERE id=?', [tcmds, message.guild.id], (err) => { if(err) console.error(err.message) })

                    return message.channel.send(`Updated blacklist`.embedify())
                    
                }
            })

        } else {
            return message.channel.send(`That is not a valid command to add to the blacklist. Please view valid commands with \`${p} blacklist list\`.`.embedify())
        }
    }
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "settings",
    name: "blacklist",
    description: "Blacklist commands so that users in your server can't use them.",
    usage: "blacklist <cmd/list(to show all commands that can be blacklisted)/show>"
}