const Discord = require('discord.js')
const fs = require('fs')

module.exports = async (client) => {
    client.wait = require("util").promisify(setTimeout)

    Array.prototype.flatten = function() {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
          }, [])
    }

    String.prototype.toProperCase = function () {
        return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })
    }

    Array.prototype.random = function () {
        return this[Math.floor(Math.random() * this.length)]
    }

    Array.prototype.shuffle = function() {
        let input = this
        for (let i = input.length-1; i >=0; i--) {
            let randomIndex = Math.floor(Math.random()*(i+1))
            let itemAtIndex = input[randomIndex]
            input[randomIndex] = input[i]
            input[i] = itemAtIndex
            return input
        }
    }

    client.genFour = function(arr=[]) {
        let com = `${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`
        if(arr.includes(com)) client.genFour(arr)
        else return com
    }

    client.embedify = function(txt) {
        return new Discord.RichEmbed().setColor(client.config.embedColor).setDescription(txt)
    }

    String.prototype.embedify = function() {
        return new Discord.RichEmbed().setColor(client.config.embedColor).setDescription(this)
    }

    client.getArraySamesLength = function(a1, a2) {
    
        let a = []

        a1.forEach((item, ind) => {
            if(a1[ind] == a2[ind]) a.push(item)
        })
    
        return a
    
    }

    client.logger = function(logMessage, logType) {
        client.emit('log', logMessage, logType)
    }

    client.checkIfDeveloper = function(id) {
        let devs = client.config.devsArray
        if(!devs.includes(id)) return false
        else return true
    }

    String.prototype.isArg = function(argNum, argArr) {
        if(argArr[argNum] == this) return true
        else return false
    }

    Array.prototype.isArg = function(argNum, argArr) {
        if(this.includes(argArr[argNum])) return true
        else return false
    }

    Number.prototype.isArg = function(argNum, argArr) {
        if(argArr[argNum] == this) return true
        else return false
    }

    Array.prototype.move = function(from,to){
        return this.splice(to,0,this.splice(from,1)[0]);
    }

    client.formatMilliseconds = function(duration) {
        let milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

        hours = (hours < 10) ? "0" + hours : hours
        minutes = (minutes < 10) ? "0" + minutes : minutes
        seconds = (seconds < 10) ? "0" + seconds : seconds

        return hours + ":" + minutes + ":" + seconds
    }

    client.checkPremium = async function(client, message) {
        return new Promise((res, rej) => {
            client.db.get('SELECT premium FROM music WHERE id=?', [message.guild.id], (err, row) => {
                if(err) rej(err)
                else res(row.premium)
            })
        })
    }

    client.getValueFromDB = async function(sql, values) {
        return new Promise((res, rej) => {
            client.db.get(sql, values, (err, row) => {
                if(err) rej(err)
                else res(row)
            })
        })
    }

    client.commandsBlacklists = async function(id) {
        return new Promise((res, rej) => {
            client.db.get('SELECT cmds FROM blacklist WHERE id=?', [id], (err, row) => {
                if(err) rej(err)
                res(row)
            })
        })
    }

    String.prototype.rowToArray = function() {
        return this.split(',')
    }
}