exports.run = (client, message, args) => {

    // if(!client.queue.get(message.guild.id)) return message.channel.send(`There is nothing playing!`.embedify())

    const s = client.queue.get(message.guild.id).songs[0]

    // let progressbar = ''

    // return console.log(percentDone())

    // let num = Math.ceil(percentDone() * 20)

    // console.log(num)

    // progressbar += '▓'.repeat(num)
    // progressbar += '░'.repeat(20 - num)

    // return message.channel.send(`Now playing - __[${s.song.info.title}](${s.song.info.uri})__ \`${client.formatMilliseconds(s.song.info.length)}\`\n\n${progressbar}\n\`${client.formatMilliseconds(s.song.info.length - client.player.get(message.guild.id).state.position)}\`\n\n*requested by <@${s.requester}>*`.embedify().setThumbnail(`https://img.youtube.com/vi/${s.song.info.identifier}/maxresdefault.jpg`))

    return message.channel.send(`Now playing - __[${s.song.info.title}](${s.song.info.uri})__ \`${client.formatMilliseconds(s.song.info.length)}\`\n\nTime left: \`${client.formatMilliseconds(s.song.info.length - client.player.get(message.guild.id).state.position)}\`\n\n*requested by <@${s.requester}>*`.embedify().setThumbnail(`https://img.youtube.com/vi/${s.song.info.identifier}/maxresdefault.jpg`))

    function percentDone() {
        return 100 * Math.abs( (s.song.info.length - client.player.get(message.guild.id).state.position) / ((s.song.info.length + client.player.get(message.guild.id).state.position) / 2))
    }
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "nowplaying",
    aliases: ['np', 'playing'],
    description: "The `nowplaying` command allows you to see the currently playing song",
    usage: "nowplaying"
}