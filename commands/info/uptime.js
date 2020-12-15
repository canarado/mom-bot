exports.run = (client, message, args) => {

    let seconds = parseInt((client.uptime / 1000) % 60),
        minutes = parseInt((client.uptime / (1000 * 60)) % 60),
        hours = parseInt((client.uptime / (1000 * 60 * 60)) % 24)

    hours = (hours < 10) ? "0" + hours : hours
    minutes = (minutes < 10) ? "0" + minutes : minutes
    seconds = (seconds < 10) ? "0" + seconds : seconds

    return message.channel.send(`:chart_with_upwards_trend: I've been running for **${hours}** hours, **${minutes}** minutes and **${seconds}** seconds!`.embedify())
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "info",
    name: "uptime",
    description: "Allows you to view how long mom has been running.",
    usage: "uptime",
}
