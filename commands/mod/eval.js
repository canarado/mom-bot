const Discord = require('discord.js')
require('dotenv').config()
const { performance } = require('perf_hooks')

exports.run = async (client, message, args) => {
	if(client.checkIfDeveloper(message.author.id)) {
		const clean = text => {
			if (typeof (text) === "string")
				return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
			else
				return text
		}

		let devText = args.join(" ")

		try {
			const code = args.join(" ")
			
			let start = performance.now()
			let evaled = eval(code)
			let end = performance.now()

			let completeTime = end - start


			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled)

			let embed = new Discord.RichEmbed()
				.addField(`Execution Time: \`${completeTime}ms\`\nInput :inbox_tray:`, `\`\`\`${devText.replace(process.env.BOT_TOKEN, '*****************')}\`\`\``)
				.addBlankField()
				.addField("Output :outbox_tray:", `\`\`\`${clean(evaled).replace(process.env.BOT_TOKEN, '*****************')}\`\`\``)
				.setColor(client.config.embedColor);

			message.channel.send(embed)

			//message.channel.send(clean(evaled), {code:"xl"})
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
		}
	} else {
		let evalList = ['NO EVAL 4 U', 'NO TOKEN 4 U', 'EVAL IS NOT 4 U', 'EVAL IS 4 DEVS', 'TRYING TO BREAK OUR BOT?', 'OOF', 'L337 H4x0r', 'OH NO, OUR TOKEN', 'OOF']
		let evalListR = evalList[Math.floor(Math.random() * evalList.length)]
		return message.channel.send('```js\n' + evalListR + '\n```')
	}
}

exports.help = {
	enabled: true,
	hideHelp: true,
	type: "mod",
	name: "eval",
	description: "Evaluates javascript code",
	usage: "eval <code to be evaled>"
}