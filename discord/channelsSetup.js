const { ChannelType } = require("discord.js")
const { DISCORD_CLIENT } = require("../index")

let activityChannelName = "activity-tracker"

console.log(process.env.DISCORD_CATEGORY)


const setup = new Promise((resolve, reject) => {
    DISCORD_CLIENT.channels.fetch(`${process.env.DISCORD_CATEGORY}`, { allowUnknownGuild: true }).then(category => {
        DISCORD_CLIENT.guilds.fetch(category.guildId).then(guild => {
            guild.channels.fetch().then(guildChannels => {
                let categoryChilds = guildChannels.filter(channels => channels.parentId == process.env.DISCORD_CATEGORY)
                let _activityChannel = categoryChilds.find(c => c.name == activityChannelName)
                if (!_activityChannel) {
                    guild.channels.create({
                        name: activityChannelName,
                        parent: process.env.DISCORD_CATEGORY,
                        type: ChannelType.GuildText,
                        topic: "Tracking de l'activite des amis du compte du bot"
                    }).then(activityChannel => { module.exports = { discordActivityChannel:activityChannel }; resolve() }).catch(reason => {reject(`Erreur setup des channels, creation de ${activityChannelName} impossible : ${reason}`)})
                } else {
                    module.exports = { discordActivityChannel: _activityChannel}
                    
                    resolve()
                }
            })
        })
    })
})
module.exports = { setup }