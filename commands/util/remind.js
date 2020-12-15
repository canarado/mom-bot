const Discord = require('discord.js')

exports.run = (client, message, [time, ...todo], prefix) => {

    if(!time) return message.channel.send(`Please choose an option for remind for me to continue! View options with \`${prefix} help remind\``.embedify())

    let errorMessage = `Incorrect time format or you went over the limit of 10 days with the reminder! Please refer to \`${prefix} remind example\` to view correct formatting options!`
    
    if(time == 'list') {

        let messages = []

        let counter = 0

        client.db.each('SELECT todo, id, time FROM reminders WHERE id=?', [message.author.id], (err, row) => {
            if(err) console.error(err.message)

            if(new Date().getTime() > row.time) {
                client.db.run('DELETE FROM reminders WHERE id=? AND todo=?', [message.author.id, row.todo], (err2) => {
                    if(err2) console.error(err2)
                })

                return
            }

            messages.push(`**${++counter}** - ${row.todo} \`in ${dhm(row.time - new Date().getTime())}\``)
        }, () => {

            if(messages.length <= 0) return message.channel.send(`You have no reminders set! Set some with \`${prefix} remind <time> <todo>\``.embedify())

            return message.channel.send(messages.join('\n').embedify())

        })

    } else if(time == 'remove' || time == 'delete') {

        if(!todo[0]) return message.channel.send(`Please select a reminder to delete. View your reminders with \`${prefix} remind list\`!`.embedify())

        let messages = []

        client.db.each('SELECT id, todo, time FROM reminders WHERE id=?', [message.author.id], (err, row) => {
            if(err) console.error(err.message)
            messages.push([row.id, row.todo, row.time])
        }, () => {

            if(!messages[todo[0] - 1]) return message.channel.send('That reminder does not exist!'.embedify())

            client.db.run('DELETE FROM reminders WHERE id=? and todo=? and time=?', [messages[todo[0] - 1][0], messages[todo[0] - 1][1], messages[todo[0] - 1][2]], (err2) => {
                if(err2) console.error(err2)
            })

            return message.channel.send(`Successfully deleted reminder to: \`${messages[todo[0] - 1][1]}\`.`.embedify())

        })

    } else if(time == 'example') {

        let embed = new Discord.RichEmbed()
        .setTitle('Example and Rules for the Remind command').setColor(client.config.embedColor)
        .addField(`Valid Timestamps`, `\`d\`, \`h\`, and \`m\` are valid timestamps. A valid combination is any number (as long as that number with the letter combination does not surpass ten days) followed by a valid timestamp character.`)
        .addField('Some examples', `Ten Minutes can be written as:\n\`${prefix} remind 10m foo\`, or even \`${prefix} remind 5m:5m foo\`\n\nWanna be reminded to shower tomorrow morning?\n\`${prefix} remind 8h:30m\` oughta do the trick.`)
        .addField('Errors', `An error will occur in the time parser anytime something invalid is inputted. Invalid expressions could be \`${prefix} remind 5h5m\` (missing the \`:\` seperator) or something like \`${prefix} remind 14d foo\` (too long time error). The parser is very exact and will error on invalid input!`)
        .addField('Some valid inputs', `\`${prefix} remind 38h foo\` - yields 38 hours\n\n\`${prefix} remind 2d:2d:2d foo\` - yields 6 days\n\n\`${prefix} remind 55m:3d:20m:4h foo\` - yields 3 days, 5 hours, and 15 minutes`)

        return message.channel.send(embed)


    } else {

        time = parseTime(time)

        todo = todo.join(' ')

        if(!time) return message.channel.send(errorMessage.embedify())

        if(!todo) return message.channel.send('Give me something to remind you about...'.embedify())

        let amount = 0

        client.db.each('SELECT todo FROM reminders WHERE id=?', [message.author.id], (err) => {
            if(err) console.error(err)

              amount++
        }, () => {
            if(amount >= 3) return message.channel.send(`You already have three reminders, please delete one to set another!`.embedify())

            client.db.run('INSERT INTO reminders(id, todo, time) VALUES(?, ?, ?)', [message.author.id, todo, time], (err) => {
                if(err) console.error(err)
            })

            message.channel.send(`I have set a reminder for you to: \`${todo}\` in ${dhm(time - new Date().getTime())}`.embedify())

            setTimeout(() => {
                message.author.send(`**Reminder!** ${todo}`.embedify()).catch(() => undefined)

                client.db.run('DELETE FROM reminders WHERE id=? and todo=?', [message.author.id, todo], (err) => {
                    if(err) console.error(err)
                })
            }, time - new Date().getTime())
        })
    }

    function parseTime(time) {
        time = time.split(':')

        let times = {
            d: 86400000,
            h: 3600000,
            m: 60000,
        }

        let usertime = 0

        let error = false

        let combinedTime = 0

        if(time.length == 1 && time[0].toLowerCase().match(new RegExp(/[a-z]/g) || []).length > 1) error = true

        if(isNaN(time[0].split('')[0])) return undefined

        time.forEach(t => {
            if(!times.hasOwnProperty(t.substr(-1))) {
                error = true
            }

            combinedTime += (Math.ceil(Math.abs(parseInt(t.replace(/\D/g, ''))) * times[t.substr(-1)]))
        })

        usertime = combinedTime

        combinedTime += new Date().getTime()

        if(usertime > 864000000) return undefined

        if(error) {
            return undefined
        } else {
            return combinedTime
        }
    }

    function dhm(t){
        var cd = 24 * 60 * 60 * 1000,
            ch = 60 * 60 * 1000,
            d = Math.floor(t / cd),
            h = Math.floor( (t - d * cd) / ch),
            m = Math.round( (t - d * cd - h * ch) / 60000),
            pad = function(n){ return n < 10 ? '0' + n : n; };
      if( m === 60 ){
        h++;
        m = 0;
      }
      if( h === 24 ){
        d++;
        h = 0;
      }
      return [d + ' days', pad(h) + ' hours', pad(m) + ' minutes'].join(', ').replace(/,(?=[^,]*$)/, ' and ')
    }
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "util",
    name: "remind",
    aliases: ['reminders', 'reminder'],
    description: `The \`remind\` command allows you to set, remove, and view reminders!\n\nPLEASE NOTE, YOU MUST ALLOW DM'S FROM THE GUILD YOU SET THE REMINDER IN TO GET THE REMINDER!\n\nCommand parses time as such, a number before a letter denotes an amount of time, for examples, \`5d\` is parsed as 5 days. So a valid input would be \`mom remind 5d:5h:30m fix my pc\` which translates to 'In five days, 5 hours, and 30 minutes, remind me to fix my pc!'\n\nRun \`mom remind example\` for all rules!`,
    usage: "remind  <<time><todo>/list/remove/delete/example>",
    limit: 10
}