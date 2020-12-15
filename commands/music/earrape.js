exports.run = (client, message, args) => {
    if(!message.member || !message.member.voiceChannel) return message.channel.send('You must be in a voice channel to use this command.'.embedify())
    if(!client.queue.get(message.guild.id)) return message.channel.send('There is nothing playing!'.embedify())

    client.player.get(message.guild.id).volume(1e6)

    return message.channel.send(`Current track is now being set to earrape.`.embedify())
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "earrape",
    aliases: ['er'],
    description: "The `earrape` command does just that, earrapes you on the current song",
    usage: "earrape"
}