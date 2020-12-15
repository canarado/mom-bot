exports.run = (client, message, args) => {
    if(!client.checkIfDeveloper(message.author.id)) return message.channel.send('You do not have access to this command.'.embedify())
    if(!args || args.length < 1) return message.channel.send("Must provide a command name to reload.".embedify())

    const commandName = args[0]

    if(!client.commands.has(commandName)) return message.channel.send("That command does not exist".embedify())

    delete require.cache[require.resolve(`./${commandName}.js`)]

    client.commands.delete(commandName)

    const props = require(`./${commandName}.js`)

    client.commands.set(commandName, props)

    message.channel.send(`The command ${commandName} has been reloaded`.embedify());
}

exports.help = {
	enabled: true,
	hideHelp: true,
	type: "mod",
	name: "reload",
	description: "reloads commands",
	usage: "reload <command name>"
}