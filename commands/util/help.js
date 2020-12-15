const Discord = require('discord.js')

exports.run = async (client, message, args) => {

    let blacklistedCommands = await client.commandsBlacklists(message.guild.id)

    client.db.get('SELECT gprefix FROM guilds WHERE id=?', [message.guild.id], (err, pref) => {
        if(err) console.error(err)
        if(args[0]) {
            let command = client.commands.has(args[0]) ? client.commands.get(args[0]) : (client.aliases.has(args[0]) ? client.aliases.get(args[0]) : null)
            if(!command) return
            const embed = new Discord.RichEmbed()
                .addField(`**${command.help.name.toProperCase()} Command**`, command.help.description)
                .addField('Usage', `\`${pref.gprefix}${command.help.usage}\``)
                .setColor(client.config.embedColor)
            if(command.help.aliases) {
                if (command.help.aliases.length > 0) embed.addField(`Aliases`, `\`${command.help.aliases.join(", ")}\``)
            }

            return message.channel.send(embed)
        } else {
            let cats = new Map()

            client.commands.forEach(c => {
                if(c.help.enabled && !c.help.hideHelp) {
                    let n = c.help.type.toProperCase()
                    if(!cats.has(n)) {
                        cats.set(n, {
                            name: n,
                            array: []
                        })
                    }

                    if(blacklistedCommands != undefined && blacklistedCommands.cmds.rowToArray().includes(c.help.name)) return
                    cats.get(n).array.push(`\`${c.help.name}\``)
                }
            })

            let embed = new Discord.RichEmbed()
                .setTitle(`Commands Info`)
                .setDescription(`Current guild prefix is \`${pref.gprefix}\`\nUse \`${pref.gprefix}help <command name>\` to view help on a specific command.`)
                .setColor(client.config.embedColor)
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL)
                .setFooter('Created by canarado')

                cats.forEach(cat => {
                    embed.addField(`**${cat.name}**`, cat.array.join(', '))
                })

                embed.addField(`**Need additional help?**`, `Have a chat with the devs of Mom on the [support server](https://discord.gg/gu7fDUq)`)

            message.channel.send(embed).catch(e => {
                message.channel.send('Something went wrong, Tell a dev or try again.')
                console.error(e)
            })
        }
    })
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "util",
    name: "help",
    aliases: ["halp", "commands", "cmds", "h"],
    description: "The `help` command displays a help menu, which contains a list of commands and a way to find further help.",
    usage: "help"
}