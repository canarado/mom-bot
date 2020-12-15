exports.run = (client, message, args) => {
    if(!message.member.hasPermission('MANAGE_GUILD') && !client.checkIfDeveloper(message.author.id)) return message.channel.send('Only a server admin may user this command!'.embedify())
    let newPrefix = args.join(' ')
    if (message.attachments.size > 0) return message.channel.send('Non-text may not be your prefix.'.embedify())
    if(newPrefix.length > 20) return message.channel.send('That prefix is too long!'.embedify())

        let data = [newPrefix, message.guild.id]

        let sql = `UPDATE guilds
                SET gprefix=?
                WHERE id=?`

        if(newPrefix == '') return message.channel.send('I am not going to give you an empty prefix...'.embedify())

        client.db.run(sql, data, (err) => {
            if(err) {
                console.error(err.message)
            }
        })

        message.channel.send(`Your guild's prefix has been updated to __${args.join(' ')}__`.embedify())
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "settings",
    name: "prefix",
    description: "The `prefix` command changes your guild's prefix to pretty much anything.",
    usage: "prefix <new prefix>",
    limit: 60
}