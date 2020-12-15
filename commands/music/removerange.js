exports.run = (client, message, args) => {
    let songs = client.queue.get(message.guild.id).songs

    if(!args[0]) return message.channel.send(`Please give a beginning and ending range (optional) in the queue to remove songs`.embedify())

    const { floor, abs } = Math

    let beginRange = floor(abs(args[0])) - 1
    let endRange = args[1] ? (args[1] - 1 > songs.length ? songs.length - 1 : floor(abs(args[1]))) : songs.length - 1

    songs.splice(beginRange, endRange - beginRange + 1)

    return message.channel.send('Removed the range of songs from the queue!'.embedify())
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "removerange",
    aliases: ['rmr'],
    description: "The `removerange` command allows you to remove a range of songs from the queue",
    usage: "removerange <starting range> <endingrange(optional)/defaults to end of queue>"
}