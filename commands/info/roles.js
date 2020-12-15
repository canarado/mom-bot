const Discord = require('discord.js')

exports.run = (client, message, args) => {
    // Role names inside the blacklist won't be included in the final list
    // Find all roles below the mom role, filter out the blacklist roles, and filter out any roles with the Administrator permission 
    // (to avoid any no perms message if a user were to try and add the role) - and then sort the filter and convert it into an array
    try {
        var blackList = ["@everyone"]

        let momRole = message.guild.roles.find(momrole => momrole.name == "mom")
        let roles = message.guild.roles.filter(allRoles => allRoles.calculatedPosition < momRole.calculatedPosition && !blackList.includes(allRoles.name)
            && !allRoles.hasPermission("ADMINISTRATOR") && allRoles.managed)
            .sort().array()



        let embed = new Discord.RichEmbed()
            .setColor(client.config.embedColor)
            .setTitle(`These are the ${roles.length} roles avaliable to you for ` + message.guild.name + '\n')
            .setDescription(roles.join(' '))
            .addField('Add roles using Mom with `<prefix> addrole <role name>`', 'Note: Only roles below the \`mom\` role are displayed')
            .setTimestamp()

        message.channel.send(embed)
    } catch (err) {
        console.log('There was an error displaying roles: ' + err)
    }
}


exports.help = {
    enabled: true,
    hideHelp: false,
    type: "info",
    name: "roles",
    description: "The `roles` command displays all roles below the \`Mom\` role.",
    usage: "roles"
}
