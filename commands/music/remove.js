exports.run = (client, message, args) => {
    if(!message.member || !message.member.voiceChannel) return message.channel.send('You must be in a voice channel to use this command.'.embedify())
    if(!client.queue.get(message.guild.id)) return message.channel.send('There is nothing playing!'.embedify())

    if(parseInt(args[0]) == 1) client.player.get(message.guild.id).stop()

    let number
    if(args[0] > client.queue.get(message.guild.id).songs.length || args[0] < 1) {
        message.channel.send(`That song number does not exist!`.embedify())
    } else if(!args[0]) {
        message.channel.send(`Please say a number of a song in the queue!`.embedify())
    } else {
        number = Math.round(args[0]-1)
        let tempInfo = client.queue.get(message.guild.id).songs[number]
        client.queue.get(message.guild.id).songs.splice(number, 1)
        return message.channel.send(`Successfully removed __${tempInfo.song.info.title}__ from the queue!`.embedify())
    }
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "remove",
    description: "The `remove` command allows you to remove certain songs in the queue",
    usage: "remove <position in queue to remove>"
}