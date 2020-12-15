exports.run = (client, message, args) => {
    if(!message.member || !message.member.voiceChannel) return message.channel.send('You must be in a voice channel to use this command.'.embedify())
    if(!client.queue.get(message.guild.id)) return message.channel.send('There is nothing playing!'.embedify())
    if(client.queue.get(message.guild.id).songs.length <= 1) return message.channel.send(`There are no songs to skip to!`.embedify())

    if(message.member.voiceChannel.members.filter(x => !x.user.bot).size >= 3 && !message.member.hasPermission('ADMINISTRATOR')) {

    let userCount = message.member.voiceChannel.members.filter(x => !x.user.bot).size
    let required = Math.ceil(userCount*.4)

    if(client.queue.get(message.guild.id).skips.includes(message.author.id)) return message.channel.send('You can not vote more than once to skip'.embedify())

    if(client.queue.get(message.guild.id).skips.length >= required) {
        client.queue.get(message.guild.id).skips.push(message.author.id)
        return message.channel.send(`**${required - client.queue.get(message.guild.id).skips.length}** more votes needed to skip`.embedify())
    }

    client.player.get(message.guild.id).stop()
    client.queue.get(message.guild.id).skips = []

    } else {
        client.player.get(message.guild.id).stop()
    }
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "skip",
    aliases: ['next', '>', '>>'],
    description: "The `skip` command allows you to skip songs, once three or more people are in the voice channel, will be decided by vote.",
    usage: "skip"
}