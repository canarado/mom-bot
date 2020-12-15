const fetch = require("node-fetch")

exports.run = async (client, message, args) => {

    try {

        wlMusic = ['633474134470295573', '430932202621108275']

        if(!wlMusic.includes(message.guild.id)) return message.channel.send("Due to YouTube enforcing harsh rate limits on anyone ripping content from their network, Mom's music search feature is disabled temporarily until a permanent fix is found. Hopefully soon.".embedify().setTitle(':no_entry_sign: This Command is Disabled for the Public Temporarily :no_entry_sign:').addField('Want to enjoy music from mom?', 'Soon I will be setting up a premium section for mom where patrons will be able to play music privately in their own servers while YouTube cucks us all.\nAlternatively, you can join any of these premium guilds to enjoy Mom\'s music.\n\n[Mom\'s Official Server](https://discord.gg/gu7fDUq)\n[Cult of Jabrils](https://discord.gg/Y7XKyXC)').setFooter('We have permissions from the admins of these servers to display the invites.'))


        // let premium = await client.checkPremium(client, message)

        // if(premium == 'false') return message.channel.send(`This is a premium feature. Please purchase Mom premium for your server.`.embedify())

        if(!message.member || !message.member.voiceChannel) return message.channel.send('You must be in a voice channel to use this command.'.embedify())
        const permissions = message.member.voiceChannel.permissionsFor(message.client.user)
        if (!permissions.has('CONNECT')) {
            return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions.'.embedify())
        }
        if (!permissions.has('SPEAK')) {
            return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions.'.embedify())
        }
    
        const serverQueue = client.queue.get(message.guild.id)

        if(!args[0]) return message.channel.send("Please give me a song to play!".embedify())
    
        const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : ''

        let urlCheck = url.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)

        let track = args.join(' ')

        let songs = await getSongs(`${track}`, urlCheck)

        if(!songs) return message.channel.send('No songs found, please try again.'.embedify())

        if(!urlCheck) songs = songs[0]

        let songObj
        let songObjArr = []
        if(!urlCheck) {
            songObj = {
                song: songs,
                requester: message.author.id
            }
        } else {
            songs.forEach(song => {
                songObjArr.push({
                    song: song,
                    requester: message.author.id
                })
            })
        }
    
        if(!serverQueue) {
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
    
            const player = await client.player.join({
                guild: message.guild.id,
                channel: message.member.voiceChannel.id,
                host: client.player.nodes.first().host
            }, {selfdeaf: true})
    
            client.queue.set(message.guild.id, queueObj)
            
            if(!urlCheck) queueObj.songs.push(songObj)
            else {
                client.queue.get(message.guild.id).songs = client.queue.get(message.guild.id).songs.concat(songObjArr)
            }
    
            if(!player) {
                message.reply('could not join')
                client.queue.delete(message.guild.id)
            }
    
            if(!urlCheck) message.channel.send(`Now playing __[${songObj.song.info.title}](${songObj.song.info.uri})__ \`${client.formatMilliseconds(songObj.song.info.length)}\``.embedify())
            else {
                let s = client.queue.get(message.guild.id).songs[0]
                message.channel.send(`Enqueued ${songObjArr.length} songs!\n\nNow playing - __[${s.song.info.title}](${s.song.info.uri})__ \`${client.formatMilliseconds(s.song.info.length)}\`\n\n*requested by <@${s.requester}>*`.embedify())
            }

            player.play(Array.isArray(songs) ? songs[0].track : songs.track)
    
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

                // __[${client.queue.get(message.guild.id).songs[0].song.info.title}](${client.queue.get(message.guild.id).songs[0].song.info.uri})__
    
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
            if(!urlCheck) {
                serverQueue.songs.push(songObj)
                return message.channel.send(`Added to queue - __[${songObj.song.info.title}](${songObj.song.info.uri})__ \`${client.formatMilliseconds(songObj.song.info.length)}\`\n*requested by <@${songObj.requester}>*`.embedify())
            } else {
                client.queue.get(message.guild.id).songs = client.queue.get(message.guild.id).songs.concat(songObjArr)
                return message.channel.send(`Enqueued ${songObjArr.length} songs!`.embedify())
            }
        }
    
        async function getSongs(search, playlist) {
            const node = client.player.nodes.first()
            console.log(playlist)

            let song = encodeURIComponent(search)

            let queryurl = `http://${node.host}:${node.port}/loadtracks?identifier=${song}`
            if(!playlist) {
                queryurl = `http://${node.host}:${node.port}/loadtracks?identifier=ytsearch:${song}`
            }
        
            return fetch(queryurl, { headers: { Authorization: node.password }})
            .then(res => res.json())
            .then(data => data.tracks)
            .catch(err => {
                console.error(err)
                return null
            })
        }
    } catch (e){}
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "music",
    name: "play",
    aliases: ['p'],
    description: "The `play` command allows you to play a song to add to the queue",
    usage: "play <song/playlist(WIP)>"
}