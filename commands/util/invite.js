const Discord = require('discord.js');

exports.run = (client, message, args) => {
    let embed = new Discord.RichEmbed()
        .setColor(client.config.embedColor)
        .setDescription(`[Click here to invite me to your server :3](https://discordapp.com/oauth2/authorize?client_id=541024861678600193&scope=bot&permissions=8)`);

    message.channel.send(embed);
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "util",
    name: "invite",
    description: "The `invite` command sends an instant invite for mom straight to your own server(s).",
    usage: "invite",
}