const Discord = require('discord.js')

module.exports = (client, guild) => {
    // client.user.setActivity(`mom help | mombot.canarado.xyz`, {type:'PLAYING'})

    const embed = new Discord.RichEmbed()
    .setColor(client.config.embedColor)
    .setTitle(`Just __left__ ${guild.name}`)
    .setDescription(`**${guild.owner.user.username}#${guild.owner.user.discriminator}** is the owner of the guild.\nGuild has **${guild.members.size}** members.\n\n`)
    .setTimestamp()

    client.shard.broadcastEval(`
    let channel = this.channels.get(client.config.logChannel);

    if(channel) channel.send(${embed})
    `)

    // client.channels.get(client.config.logChannel).send(embed)

    client.db.run('DELETE FROM guilds WHERE id=?', [guild.id], (err) => {
        if(err) console.error(err)
    })
}