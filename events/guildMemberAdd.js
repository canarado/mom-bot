module.exports = (client, member) => {
    // client.db.get('SELECT welcomechan, welcometext, welcomeenable FROM guilds WHERE id=?', [member.guild.id], (err, row) => {
    //     if(err) {
    //         console.error(err.message)
    //     } else if(row == undefined) {
    //         client.db.run('INSERT INTO guilds(id, guildname, gprefix, welcomechan, welcomeenable, starboard, starboardAdmin) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [guild.id, guild.name, 'mom ', null, null, 0, 0, 0], (err2, row) => {
    //             if(err2) console.error(err.message)
    //             return
    //         })
    //     } else if(row.welcomechan == null || row.welcometext == null || row.welcomeenable == 0) {
    //         return
    //     } else {
    //         if(row.welcomeenable != 1) return
    //         let welcomemessage = row.welcometext.toString().replace(/\{\{\}\}/g, `<@${member.id}>`).replace(/\[\[/g, '<#').replace(/\]\]/g, `>`)
    //         let welcomechannel = member.guild.channels.get(row.welcomechan)
    //         if(!welcomechannel) return
            
    //         welcomechannel.send(welcomemessage)
    //     }
    // })
}