const Discord = require('discord.js')
const _  = require('lodash')

///////////////////////////////
//            WIP            //
///////////////////////////////

const symbols = ':banana: :cherries: :kiwi: :sunny: :100: :frog: :watermelon: :spades: :clubs:'.split(' ')

const winningCombos = [
    [symbols[0], symbols[0], symbols[0]],
    [symbols[1], symbols[1], symbols[1]],
    [symbols[2], symbols[2], symbols[2]],
    [symbols[3], symbols[3], symbols[3]],
    [symbols[4], symbols[4], symbols[4]],
    [symbols[5], symbols[5], symbols[5]],
    [symbols[6], symbols[6], symbols[6]],
    [symbols[7], symbols[7], symbols[7]],
    [symbols[8], symbols[8], symbols[8]],
    [symbols[0], symbols[1], symbols[2]],
    [symbols[8], symbols[7], symbols[4]],
    [symbols[4], symbols[4], symbols[0]],
    [symbols[4], symbols[4], symbols[1]],
    [symbols[4], symbols[4], symbols[2]],
    [symbols[4], symbols[4], symbols[3]],
    [symbols[4], symbols[4], symbols[5]],
    [symbols[4], symbols[4], symbols[6]],
    [symbols[4], symbols[4], symbols[7]],
    [symbols[4], symbols[4], symbols[8]]
]

exports.run = (client, message, args) => {

    if(client.slotSet.has(message.author.id)) return message.channel.send('You can only play the casino every 5 minutes when won!'.embedify())

    if(!args[0] || isNaN(args[0]) || args[0] <= 0) return message.channel.send('Please give a valid bet to place on the slot machine!'.embedify())
    if(Math.abs(args[0]) > 1000) return message.channel.send(`You may not bet more than 1000 treats on the slot machine!`.embedify())
    args[0] = parseInt(Math.floor(Math.abs(args[0])))

    client.db.get('SELECT treats FROM users WHERE id=?', [message.author.id], (err, row) => {
        if(err) return console.error(err.message)

        if(args[0] > row.treats) return message.channel.send('You do not have enough treats to spin with that amount!'.embedify())

        let embed = new Discord.RichEmbed().setColor(client.config.embedColor).setTitle(`Slots! :slot_machine:`)
        .setDescription(
            `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n` +
            `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n` +
            `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n`
        )

        message.channel.send(embed).then(x => {
            setTimeout(() => {
                let newDesc1 = `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n` +
                    `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n` +
                    `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n`

                const newEmbed1 = new Discord.RichEmbed({
                    title: embed.title,
                    description: newDesc1,
                    color: embed.color
                })

                x.edit(newEmbed1)

                setTimeout(() => {
                    let newDesc2 = `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n` +
                    `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n` +
                    `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n`

                    let newEmbed2 = new Discord.RichEmbed({
                        title: embed.title,
                        description: newDesc2,
                        color: embed.color
                    })

                    x.edit(newEmbed2)

                    setTimeout(() => {

                        let mult = Math.random() > .95 ? 0.5 : 0

                        let won = Math.random() > 0.70 ? true : false

                        let total = Math.ceil(args[0] * (1.5 + mult))

                        let desc3

                        if(won) {
                            desc3 = `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n` +
                            `${winningCombos.random().join(' | ')}\n` +
                            `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n`
                        } else {
                            desc3 = `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n` +
                            `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n` +
                            `${symbols.random()} | ${symbols.random()} | ${symbols.random()}\n`
                        }

                        let newEmbed3 = new Discord.RichEmbed({
                            title: embed.title,
                            description: desc3,
                            color: embed.color
                        })

                        x.edit(newEmbed3)

                        setTimeout(() => {

                            if(won) { // handle win

                                client.slotSet.add(message.author.id)
                                setTimeout(() => {
                                    client.slotSet.delete(message.author.id)
                                }, 60000 * 5)

                                let winemb = new Discord.RichEmbed({
                                    title: `You won ${total} treats!`,
                                    description: desc3,
                                    color: embed.color
                                })

                                x.edit(winemb)

                                client.db.run('UPDATE users SET treats=? WHERE id=?', [row.treats + total, message.author.id], (winerr) => {
                                    if(winerr) console.error(winerr.message)
                                })
                                
                            } else { // handle loss

                                let lossemb = new Discord.RichEmbed({
                                    title: `You lost ${args[0]} treats!`,
                                    description: desc3,
                                    color: embed.color
                                })

                                x.edit(lossemb)

                                client.db.run('UPDATE users SET treats=? WHERE id=?', [row.treats - args[0], message.author.id], (losserr) => {
                                    if(losserr) console.error(losserr.message)
                                })
                            }
                        }, 1500)
                    }, 1500)
                }, 1500)
            }, 1500)
        })
    })
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "economy", 
    name: "slots",
    aliases: ['casino', 'slotmachine', 'sm'],
    description: "A slots machine to spin on and bet your treats!",
    usage: "slots <amount to bet>"
}