const Discord = require('discord.js')

module.exports = (client, guild) => {
    try {

        // client.user.setActivity(`mom help | mombot.canarado.xyz`, {type:'PLAYING'})

        let bots = guild.members.filter(type => type.user.bot).size
        let people = guild.members.filter(type => !type.user.bot).size
        let embed = new Discord.RichEmbed()
            .setColor(client.config.embedColor)
            .setTitle(`Just __joined__ ${guild.name}`)
            .setDescription(`**${guild.owner.user.username}#${guild.owner.user.discriminator}** is the owner of the guild.\nGuild has **${guild.members.size}** members.\n\n`)
            .addField("People: ", people, true)
            .addField("Bots: ", bots, true)
            .setTimestamp()

        client.shard.broadcastEval(`
        let channel = this.channels.get(client.config.logChannel);

        if(channel) channel.send(${embed});
        `)

        // client.channels.get(client.config.logChannel).send(embed)

        client.db.get('SELECT gprefix FROM guilds WHERE id=?', [guild.id], (err, row) => {
            if(err) console.error(err.message)
            if(row == undefined) {
                client.db.run('INSERT INTO guilds(id, guildname, gprefix, welcomechan, welcometext, welcomeenable, starboard, starboardAdmin) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [guild.id, guild.name, 'mom ', null, null, 0, 0, 0], (err) => {
                    if(err) {
                        console.error(err.message)
                    }
                })
            } else {
                return
            }
        })

    } catch (e) {
        console.error(e)
    }
}