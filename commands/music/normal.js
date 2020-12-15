exports.run = (client, message, args) => {
    if(!message.member || !message.member.voiceChannel) return message.channel.send('You must be in a voice channel to use this command.'.embedify())
    if(!client.queue.get(message.guild.id)) return message.channel.send('There is nothing playing!'.embedify())

    client.player.get(message.guild.id).volume(100)
    client.player.get(message.guild.id).setEQ([
        {"band": 0, "gain": 0},
        {"band": 1, "gain": 0},
        {"band": 2, "gain": 0},
        {"band": 3, "gain": 0},
        {"band": 4, "gain": 0},
        {"band": 5, "gain": 0},
        {"band": 6, "gain": 0},
        {"band": 7, "gain": 0},
        {"band": 8, "gain": 0},
        {"band": 9, "gain": 0}
    ])

    return message.channel.send(`Current track's bass and volume has been normalized.`.embedify())
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "normal",
    aliases: ['fixvol', 'norm'],
    description: "The `normal` command reverts all sound settings to the default for the current playing track.",
    usage: "normal"
}