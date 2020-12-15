exports.run = (client, message, args) => {
	client.shard.fetchClientValues('player.size').then(res => {
		message.channel.send(`${res.reduce((prev, curr) => prev + curr, 0)} active players`.embedify())
	})
	.catch(e => console.error)
}

exports.help = {
	enabled: true,
	hideHelp: true,
	type: "mod",
	name: "eval",
	description: "activeplayers",
	usage: "activeplayers"
}