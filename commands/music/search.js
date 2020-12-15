const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const Discord = require('discord.js')

exports.run = async (client, message, args) => {
try {

    return message.channel.send("Due to YouTube enforcing harsh rate limits on anyone ripping content from their network, Mom's music search feature is disabled temporarily until a permanent fix is found. Hopefully soon.".embedify().setTitle(':no_entry_sign: This Command is Temporarily Disabled :no_entry_sign:'))

    return message.channel.send('This command is temporar')

    if(!message.member || !message.member.voiceChannel) return message.channel.send('You must be in a voice channel to use this command.'.embedify())
    const permissions = message.member.voiceChannel.permissionsFor(message.client.user)
    if (!permissions.has('CONNECT')) {
        return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions.'.embedify())
    }
    if (!permissions.has('SPEAK')) {
        return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions.'.embedify())
    }

    const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : ''

    const urlCheck = url.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/)

    if(urlCheck) client.commands.get('play').run(client, message, args)

    // if(urlCheck) return client.commands.get('play').run(client, message, args)

    const track = args.join(' ')
    const res = await getSongs(`ytsearch: ${track}`)
    if(!res) return message.channel.send('No songs found, please try again.'.embedify())
    const song = res.slice(0, 10)

    let index = 0

    let embed = new Discord.RichEmbed().setColor(client.config.embedColor)
    .setDescription(`Please provide a value to select one of the search results ranging from 1-10.\n\n${song.map(ind => `**${++index} -** ${ind.info.title}`).join('\n')}`)
    .setFooter(`Enter cancel to stop the search`)

    if(!urlCheck) {
    
        message.channel.send(embed)

        const collector = message.channel.createMessageCollector(msg => msg.content > 0 && msg.content < 11 && msg.author.id == message.author.id || msg.content == 'cancel' && msg.author.id == message.author.id, {time: 15000})

        collector.on('collect', async data => {
            collector.stop()
            if(data.content == 'cancel') return message.channel.send(`Cancelling search`.embedify())
            const songInd = parseInt(data.content)
            let songObj = {
                song: song[songInd-1],
                requester: message.author.id
            }

            if(!client.queue.get(message.guild.id)) {
                const queueObj = {
                    tc: message.channel.id,
                    guild: message.guild.id,
                    vc: message.member.voiceChannel.id,
                    connection: null,
                    songs: [],
                    playing: true,
                    loop: false,
                    skips: []
                }

                client.queue.set(message.guild.id, queueObj)
                queueObj.songs.push(songObj)

                const player = await client.player.join({
                    guild: message.guild.id,
                    channel: message.member.voiceChannel.id,
                    host: client.player.nodes.first().host
                }, {selfdeaf: true})

                if(!player) {
                    message.reply('could not join')
                    client.queue.delete(message.guild.id)
                }

                message.channel.send(`Now playing __[${songObj.song.info.title}](${songObj.song.info.uri})__ \`${client.formatMilliseconds(songObj.song.info.length)}\``.embedify())
                player.play(song[songInd-1].track)

                player.on('error', console.error)
                player.on('end', async () => {
                    if(client.queue.get(message.guild.id).songs.length <= 1 && !client.queue.get(message.guild.id).loop || message.guild.me.voiceChannel.members.filter(x => !x.user.bot).size < 1) {
                        client.player.leave(message.guild.id)
                        return client.queue.delete(message.guild.id)
                    }
        
                    client.queue.get(message.guild.id).skips = []

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
        
                    if(client.queue.get(message.guild.id).loop) {
                        client.queue.get(message.guild.id).songs.push(client.queue.get(message.guild.id).songs.shift())
                        player.play(client.queue.get(message.guild.id).songs[0].song.track)
                    } else if(!client.queue.get(message.guild.id).loop) {
                        client.queue.get(message.guild.id).songs.shift()
                        player.play(client.queue.get(message.guild.id).songs[0].song.track)
                        message.channel.send(`Now playing - __[${client.queue.get(message.guild.id).songs[0].song.info.title}](${client.queue.get(message.guild.id).songs[0].song.info.uri})__ \`${client.formatMilliseconds(client.queue.get(message.guild.id).songs[0].song.info.length)}\`\n*requested by <@${client.queue.get(message.guild.id).songs[0].requester}>*`.embedify())
                    }
                })
            } else {
                client.queue.get(message.guild.id).songs.push(songObj)
                return message.channel.send(`Added to queue - __[${songObj.song.info.title}](${songObj.song.info.uri})__ \`${client.formatMilliseconds(songObj.song.info.length)}\`\n*requested by <@${songObj.requester}>*`.embedify())
            }
        })

        collector.on('end', async (x, reason) => {
            if(reason === 'time') return message.channel.send(`No or invalid value entered, cancelling video selection`.embedify())
        })

    }

    async function getSongs(search) {
        const node = client.player.nodes.first()
    
        const params = new URLSearchParams()
        params.append('identifier', search)
    
        return fetch(`http://${node.host}:${node.port}/loadtracks?${params.toString()}`, {headers: {Authorization: node.password}})
        .then(res => res.json())
        .then(data => data.tracks)
        .catch(err => {
            console.error(err)
            return null
        })
    }
} catch (e){
    if(e.message == 'Music is a premium only, WIP command. Please contact a developer for more information!') message.channel.send(e.message)
}
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "search",
    description: "The `search` command allows you to search songs and then choose which you want to play/add to queue",
    usage: "search <what to search for>"
}