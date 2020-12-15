const _ = require('lodash')

exports.run = (client, message, args) => {
    if(!message.member || !message.member.voiceChannel) return message.channel.send('You must be in a voice channel to use this command.'.embedify())
    if(!client.queue.get(message.guild.id)) return message.channel.send('There is nothing playing!'.embedify())

    let uniq = _.uniqBy(client.queue.get(message.guild.id).songs, 'song.track')
    client.queue.get(message.guild.id).songs = uniq

    return message.channel.send(`Removed duplicates from the queue`.embedify())
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "removedupes",
    aliases: ['rd', 'unique'],
    description: "The `removedupes` command allows you to remove all duplicate songs from the queue",
    usage: "removedupes"
}