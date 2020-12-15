const Discord = require('discord.js')

exports.run = (client, message, args) => {
    if(!client.queue.get(message.guild.id)) return message.channel.send('There is nothing playing!'.embedify())

    let count, page

    page = args[0] >= 1 ? args[0] : 1

    count = page === 1 ? 0 : Math.round(page*10) - 10

    const songs = client.queue.get(message.guild.id).songs
    const output = songs.slice((page-1) *10, page*10)
    if(args[1] > Math.ceil(songs.length / 10)) {
        message.channel.send(`That page does not exist`.embedify())
    } else {
        let arrayOfSecs = client.queue.get(message.guild.id).songs.map(song => song.song.info.length)
        let totalms = arrayOfSecs.reduce((prev, val) => prev + val)
        let pretty = client.formatMilliseconds(totalms)
        let embed = new Discord.RichEmbed().setColor(client.config.embedColor)
        .setDescription(`__Page:__ ${page}/${Math.ceil(songs.length / 10)} ${client.queue.get(message.guild.id).loop ? ':repeat:' : ''}\n\n${output.map(song => `**${++count} -** [${song.song.info.title}](${song.song.info.uri}) \`${client.formatMilliseconds(song.song.info.length)}\` *<@${song.requester}>*`).join('\n')}`)
        .setFooter(`Queue Total Time: ${pretty}`)
        return message.channel.send(embed)
    }
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "queue",
    aliases: ['q'],
    description: "The `queue` command allows you to view the current queue of music",
    usage: "queue",
    limit: 5
}