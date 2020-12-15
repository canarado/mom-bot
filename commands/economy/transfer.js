const Discord = require('discord.js')

let d = new Date()

let now = Math.round(d.getTime() / 1000)

let newUserDaily = now - 86400

exports.run = async (client, message, args) => {
    try{
        let toTransfer = message.mentions.users.first()
        if(!toTransfer) return message.channel.send('You must mention a user to transfer treats to.'.embedify())
        if(toTransfer.id == message.author.id) return message.channel.send('Cannot transfer funds to yourself!'.embedify())
        if(toTransfer.bot) return message.channel.send('Bots do not have accounts.'.embedify())
        if(!args[0] || isNaN(args[0])) return message.channel.send('Please supply an amount and a user to transfer.'.embedify())
        
        let amount = Math.floor(Math.abs(args[0]))
        
        client.db.get('SELECT treats FROM users WHERE id=?', [toTransfer.id], async (err, row1) => {
            if(err) {
                console.error(err.message)
            } else if(row1 == undefined) {
                client.db.run('INSERT INTO users(id, username, treats, xp, daily) VALUES(?, ?, ?, ?, ?)', [toTransfer.id, toTransfer.username, 0, 0, newUserDaily], (err) => {
                    if(err) {
                    console.error(err.message)
                    }
                })
                return message.channel.send('That user does not exist in my Database! Give me two seconds to set up an account for them, and try again!'.embedify())
            } else {

                let collectortext = ['cancel']

                let randint = `${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`

                collectortext.push(randint)

                message.channel.send(`Pending transaction for \`${amount}\` from __${message.author.username}__ to __${toTransfer.username}__\n\nTo confirm transaction, please enter \`${collectortext[1]}\`.\nTo cancel the transaction, please enter \`cancel\``.embedify())

                const collector = message.channel.createMessageCollector(msg => msg.author.id === message.author.id, { time: 15000 })

                collector.on("collect", async (x) => {
                    if(x.content == collectortext[0]) {
                        collector.stop()
                        return message.channel.send('Transaction was canceled!'.embedify())

                    } else if(x.content == collectortext[1]) {
                        client.db.get('SELECT treats FROM users WHERE id=?', [message.author.id], async (err, row2) => {
                            if(err) {
                                console.error(err.message)
                            } else if(row2 == undefined) {
                                return message.channel.send('It seems I don\'t have any record of you.'.embedify())
                            } else {
                                if(row2.treats - amount < 0) return message.channel.send('You do not have enough funds to complete the transaction.'.embedify())
        
                                    client.db.serialize(() => {
                                        client.db.run('UPDATE users SET treats=treats-? WHERE id=?', [amount, message.author.id], (err) => {
                                            if(err) {
                                                console.error(err.message)
                                            }
                                        })
                                        client.db.run('UPDATE users SET treats=treats+? WHERE id=?', [amount, toTransfer.id], (err) => {
                                            if(err) {
                                                console.error(err.message)
                                            }
                                        })
                                    })
                                    message.channel.send(`Transaction complete: Your new balance is ${row2.treats - amount}`.embedify())
                            }
                        })
                        collector.stop()
                    } else {
                        message.channel.send(`Valid inputs are \`${collectortext[1]}\` to complete the transaction or \`cancel\` to cancel the transaction.`.embedify())
                    }
                })

                collector.on('end', (collected, reason) => {
                    if(reason === 'time') {
                        message.channel.send('Canceling transaction due to time.'.embedify())
                    }
                })
            }
        })
    } catch (err) {
        console.log(err)
    }
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "economy",
    aliases: ["gift", "give", "pay"],
    name: "transfer",
    description: "The `transfer` command allows you to give some of your treats to another user.",
    usage: "transfer <amount to transfer> <mention user>",
    limit: 15
}