const request = require("request")
const Discord = require('discord.js')

exports.run = (client, message, args) => {
    if(!client.queue.get(message.guild.id) && !args[0]) return message.channel.send('There is nothing playing!'.embedify())

    let tempinfo = args[0] ? args.join(' ') : client.queue.get(message.guild.id).songs[0].song.info.title

    request(`https://some-random-api.ml/lyrics?title=${tempinfo}`, (err, _response, body) => {
        if(err) return message.channel.send(`It appears there was an error, please contact the (devs)[]!`.embedify())
        body = JSON.parse(body)

        let lyrics = body.lyrics.match(/[\s\S]{1,2000}/g)
        
        if(lyrics.length > 1) {

            if(lyrics.length > 3) lyrics = lyrics.slice(0, 4)

            let embed = new Discord.RichEmbed().setTitle(`${body.title} *by* ${body.author}`).setColor(client.config.embedColor).setDescription(lyrics[0])

            message.channel.send(embed)

            lyrics.shift()

            lyrics.forEach(lyric => message.channel.send(`${lyric}`.embedify()))
            

        } else {
            let embed = new Discord.RichEmbed().setTitle(`${body.title} *by* ${body.author}`).setColor(client.config.embedColor).setDescription(lyrics[0])

            return message.channel.send(embed)
        }
    })

}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "lyrics",
    description: "The `lyrics` command allows you to view lyrics for the currently playing song if any lyrics are available",
    usage: "lyrics"
}