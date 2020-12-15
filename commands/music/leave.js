exports.run = async (client, message, args) => {
    if(!message.member.voiceChannel || !message.guild.me.voiceChannel) return message.channel.send('Both you and I must be a voicechannel for me to leave!'.embedify())

    if(client.queue.get(message.guild.id)) client.queue.delete(message.guild.id)

    await client.player.leave(message.guild.id)
    return message.channel.send('Successfully left the voice channel.'.embedify())
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "leave",
    aliases: ['dc', 'gtfo', 'stop'],
    description: "The `leave` command makes mom leave the current guilds vc",
    usage: "leave"
}