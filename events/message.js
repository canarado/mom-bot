module.exports = async (client, message) => {
    if(message.author.bot) return
    if(!message.channel) return
    let d = new Date()

    let now = Math.round(d.getTime() / 1000)

    let newUserDaily = now - 86400

    let newUserWork = now - 7200

    try {

        client.db.get('SELECT id, work FROM users WHERE id=?', [message.author.id], (err, row) => {
            if(err) {
                console.error(err)
            } else if(row == undefined) {
                client.db.run('INSERT INTO users(id, username, treats, xp, daily, work) VALUES(?, ?, ?, ?, ?, ?)', [message.author.id, message.author.username, 0, 0, newUserDaily, newUserWork], (err) => {
                    if(err) {
                        console.error(err)
                    }
                })
            } else if (!client.msgcooldown.has(message.author.id)) {
                client.db.run('UPDATE users SET treats=treats+1, xp=xp+0.5, username=? WHERE id=?', [message.author.username, message.author.id], (err) => {
                    if(err) console.error(err)
                })
                client.msgcooldown.add(message.author.id)
                setTimeout(() => {
                    client.msgcooldown.delete(message.author.id)
                }, 10000)
            }

            if(row && !row.work) {
                client.db.run('UPDATE users SET work=? WHERE id=?', [newUserWork, message.author.id], (err4) => {
                    if(err4) console.error(err4)
                })
            }
        })

        client.db.get('SELECT gprefix FROM guilds WHERE id=?', [message.guild.id], async (err, row) => {
            if(err) console.error(err)
            else if(row == undefined) {
                client.db.run('INSERT INTO guilds(id, guildname, gprefix, welcomechan, welcometext, welcomeenable, starboard, starboardAdmin) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [message.guild.id, message.guild.name, 'mom ', null, null, 0, 0, 0], (err) => {
                    if(err) console.error(err)
                })
            } else {
                client.db.run('UPDATE guilds SET guildname=? WHERE id=?', [message.guild.name, message.guild.id], (err) => {
                    if(err) console.error(err)
                })

                prefix = row == undefined ? 'mom ' : row.gprefix
                if(message.content.startsWith(`<@${client.user.id}>`)) prefix = `<@${client.user.id}> `
                if(!prefix) return

                if(!message.content.includes(prefix)) return
                if(!message.content.startsWith(prefix)) return
                const args = message.content.slice(prefix.length).trim().split(/ +/g)
                const command = args.shift().toLowerCase()
                const cmd = client.commands.has(command) ? client.commands.get(command) : (client.aliases.has(command) ? client.aliases.get(command) : null)

                if(!cmd) return

                if(!client.checkIfDeveloper(message.author.id)) {
                    let blacklistedCommands = await client.commandsBlacklists(message.guild.id)

                    if(blacklistedCommands != undefined && blacklistedCommands.cmds && blacklistedCommands.cmds.rowToArray().includes(cmd.help.name)) {
                        message.delete()
                        return message.channel.send(`That command has been blacklisted by your server's admins. Sorry.`.embedify()).then(msg => {
                            msg.delete(3000)
                        })
                    }

                    if(!client.cooldowns.has(cmd.help.name)) {
                        client.cooldowns.set(cmd.help.name, new Map())
                    }

                    let newNow = Date.now()
                    let timestamps = client.cooldowns.get(cmd.help.name)

                    let cooldownAmt = (cmd.help.limit || 1.5) * 1000

                    if(timestamps.has(message.author.id)) {
                        let expirationTime = timestamps.get(message.author.id) + cooldownAmt

                        if (newNow < expirationTime) {
                            let timeLeft = (expirationTime - newNow) / 1000
                            return message.channel.send(`You must wait ${timeLeft.toFixed(1)} more second(s) before using the \`${cmd.help.name}\` command again.`.embedify())
                        }
                    }

                    timestamps.set(message.author.id, newNow)
                    setTimeout(() => timestamps.delete(message.author.id), cooldownAmt)
                }

                if(message.content.startsWith(prefix)) cmd.run(client, message, args, prefix)
            }
        })

        client.db.get('SELECT premium FROM music WHERE id=?', [message.guild.id], (err, row) => {
            if(err) console.error(err)
            else if(row == undefined) {
                client.db.run('INSERT INTO music(id, premium, djonly, djroles) VALUES(?, ?, ?, ?)', [message.guild.id, 'false', 'false', '0'], (err) => {
                    if(err) console.error(err)
                })
            }
        })

    } catch (e) {
        console.error(e)
    }
}