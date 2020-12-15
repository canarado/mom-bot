exports.run = (client, message, args) => {
    if(!message.member || !message.member.voiceChannel) return message.channel.send('You must be in a voice channel to use this command.'.embedify())
    if(!client.queue.get(message.guild.id)) return message.channel.send('There is nothing playing!'.embedify())

    if(client.queue.get(message.guild.id).loop) {
        client.queue.get(message.guild.id).loop = false
        return message.channel.send(`Queue will no longer loop`.embedify())
    } else if(!client.queue.get(message.guild.id).loop) {
        client.queue.get(message.guild.id).loop = true
        return message.channel.send(`Queue will now loop`.embedify())
    }
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "loop",
    aliases: ['l', 'repeat'],
    description: "The `loop` command allows you to loop the current queue",
    usage: "loop"
}