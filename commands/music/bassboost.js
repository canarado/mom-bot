exports.run = (client, message, args) => {
    if(!message.member || !message.member.voiceChannel) return message.channel.send('You must be in a voice channel to use this command.'.embedify())
    if(!client.queue.get(message.guild.id)) return message.channel.send('There is nothing playing!'.embedify())

    
    if(args[0] == 'low') {
        client.player.get(message.guild.id).setEQ([
            {"band": 0, "gain": 2},
            {"band": 1, "gain": 4},
            {"band": 2, "gain": -4},
            {"band": 3, "gain": -2}
        ])
    } else if(args[0] == 'medium') {
        client.player.get(message.guild.id).setEQ([
            {"band": 0, "gain": 3},
            {"band": 1, "gain": 6},
            {"band": 2, "gain": -6},
            {"band": 3, "gain": -3}
        ])
    } else if(args[0] == 'high') {
        client.player.get(message.guild.id).setEQ([
            {"band": 0, "gain": 4},
            {"band": 1, "gain": 8},
            {"band": 2, "gain": -8},
            {"band": 3, "gain": -4}
        ])
    } else {
        client.player.get(message.guild.id).setEQ([
            {"band": 0, "gain": 3},
            {"band": 1, "gain": 6},
            {"band": 2, "gain": -6},
            {"band": 3, "gain": -3}
        ])
    }

    return message.channel.send('Current track is now being bassboosted.'.embedify())
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "bassboost",
    aliases: ['bb', 'bass'],
    description: "The `bassboost` command allows you to bassboost the current song",
    usage: "bassboost <optional:low/medium(default)/high>"
}