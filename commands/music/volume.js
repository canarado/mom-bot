exports.run = (client, message, args) => {
    if(!message.member || !message.member.voiceChannel) return message.channel.send('You must be in a voice channel to use this command.'.embedify())
    if(!client.queue.get(message.guild.id)) return message.channel.send('There is nothing playing!'.embedify())

    if(!args[0] || args[0] < 1 || args[0] > 100 || isNaN(args[0])) return message.channel.send(`Please give me correct input to change the volume \`valid input: 1-100\``.embedify())

    let vol = Math.floor(Math.abs(parseInt(args[0])))
    client.player.get(message.guild.id).volume(vol)
    return message.channel.send(`Updated the volume to ${vol}%`.embedify())
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "volume",
    aliases: ['v', 'vol'],
    description: "The `volume` command allows you to change the volume of mom's music. `NOTE: Requires mom premium`\nPlease be aware that changing the stream volume will lower the quality of the music due to encoding rules",
    usage: "volume <amount(1-100)>"
}