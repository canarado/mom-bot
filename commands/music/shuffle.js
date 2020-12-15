exports.run = (client, message, args) => {
    if(!message.member || !message.member.voiceChannel) return message.channel.send('You must be in a voice channel to use this command.'.embedify())
    if(!client.queue.get(message.guild.id)) return message.channel.send('There is nothing playing!'.embedify())

    let temp = client.queue.get(message.guild.id).songs

    let newA = temp.shift()

    for(let i = 0; i < 20; i++) {
        temp.shuffle()
    }

    newA = [newA].concat(temp)

    client.queue.get(message.guild.id).songs = newA

    return message.channel.send(`Queue has been shuffled`.embedify())

}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "shuffle",
    aliases: ['mix'],
    description: "The `shuffle` command allows you to shuffle the current queue",
    usage: "shuffle",
    limit: 8
}