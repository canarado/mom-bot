const Discord = require('discord.js')

exports.run = (client, message, args) => {
    try{

        if(!args[0]) return message.channel.send('Gimmie a role ya big silly'.embedify());
        
        let role = args.join(' ').toLowerCase()
     
            if(message.guild.roles.find(x => x.name.toLowerCase() === role) == undefined) return message.channel.send(`Unfortunately that role, **${role}**, does not exist`.embedify())
            else if(message.member.roles.has(role.id)) return message.channel.send(`You already have that role!`.embedify())
            else {
                message.member.addRole(`${roleToAdd.id}`)
                    .catch(error => {
                        console.error;
                        message.react('❎');
                        if (error == "DiscordAPIError: Missing Permissions")
                            return message.channel.send(`You lack the power to gain a role as noble as ${roleToAdd}`.embedify());
                        else
                            return message.channel.send(`Unexpected error | ${error}`.embedify());
                    })
            }

        } catch (e) {
            console.error(e.message)
        }
}
exports.help = {
    enabled: true,
    hideHelp: false,
    type: "util",
    name: "addrole",
    description: "Allows mom to give you the provided role",
    usage: "addrole <role\'s name>",
}