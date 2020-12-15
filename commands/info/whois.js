const Discord = require('discord.js')

exports.run = (client, message, args) => {

	let roleToGetInfoFor = args.join(' ')

    if(!message.guild.roles.find(role => role.name == roleToGetInfoFor)) return message.channel.send('That role does not exist!'.embedify())

    let hasIt = message.guild.roles.find(role => role.name == roleToGetInfoFor).members.array()

    if(hasIt.length > 50) return message.channel.send(`Too many users to display: ${hasIt.length}`)

    let embed = new Discord.RichEmbed().setColor(client.config.embedColor)
	.setTitle(`Who is ${roleToGetInfoFor}`)
	.setDescription(hasIt.map(mem => `${mem.displayName}`).join('\n'))
    .setFooter(`${hasIt.length} users have this role`)

    message.channel.send(embed)
}

exports.help = {
	enabled: true,
	hideHelp: false,
	type: "info",
	name: "whois",
	description: "The `whois` command displays a list of all people with a requested role.",
	usage: "whois <name of role>",
}