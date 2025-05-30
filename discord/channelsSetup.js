const { ChannelType } = require("discord.js")
const { DISCORD_CLIENT } = require("../index")

let activityChannelName = "activity-tracker"
let groupChannelName = "group-informations"

console.log(process.env.DISCORD_CATEGORY)


const setupold = new Promise((resolve, reject) => {
    DISCORD_CLIENT.channels.fetch(`${process.env.DISCORD_CATEGORY}`, { allowUnknownGuild: true }).then(category => {
        DISCORD_CLIENT.guilds.fetch(category.guildId).then(guild => {
            guild.channels.fetch().then(async guildChannels => {
                let categoryChilds = guildChannels.filter(channels => channels.parentId == process.env.DISCORD_CATEGORY)
                let _activityChannel = categoryChilds.find(c => c.name == activityChannelName)
                if (!_activityChannel) {
                    await guild.channels.create({
                        name: activityChannelName,
                        parent: process.env.DISCORD_CATEGORY,
                        type: ChannelType.GuildText,
                        topic: "Tracking de l'activite des amis du compte du bot"
                    }).then(activityChannel => {
                        module.exports = { discordActivityChannel: activityChannel };
                    }).catch(reason => { reject(`Erreur setup des channels, creation de ${activityChannelName} impossible : ${reason}`) })
                } else {
                    module.exports = { discordActivityChannel: _activityChannel }
                }
                let _groupChannel = categoryChilds.find(c => c.name == groupChannelName)
                if (!_groupChannel) {
                    await guild.channels.create({
                        name: groupChannelName,
                        parent: process.env.DISCORD_CATEGORY,
                        type: ChannelType.GuildText,
                        topic: "Envoie les informations de groupes sur lequel le bot est present"
                    }).then(groupChannel => {
                        module.exports = { discordGroupChannel: groupChannel };
                    }).catch(reason => { reject(`Erreur setup des channels, creation de ${groupChannelName} impossible : ${reason}`) })
                } else {
                    module.exports = { discordGroupChannel: _groupChannel }
                }
                resolve()
            })
        })
    })
})


const ActivityTracker = new Promise(async (resolve, reject) => {
    DISCORD_CLIENT.channels.fetch(`${process.env.DISCORD_CATEGORY}`, { allowUnknownGuild: true }).then(category => {
        DISCORD_CLIENT.guilds.fetch(category.guildId).then(guild => {
            guild.channels.fetch().then(async guildChannels => {
                let categoryChilds = await guildChannels.filter(channels => channels.parentId == process.env.DISCORD_CATEGORY)
                let fetchedChannel = await categoryChilds.find(c => c.name == activityChannelName)
                if (!fetchedChannel) {
                    await guild.channels.create({
                        name: activityChannelName,
                        parent: process.env.DISCORD_CATEGORY,
                        type: ChannelType.GuildText,
                        topic: "Tracking de l'activite des amis du compte du bot"
                    }).then(createdChannel => {
                        resolve(createdChannel)
                    }).catch(reason => { reject(reason) })
                } else {
                    resolve(fetchedChannel)
                }
            })
        })
    })
})


const GroupTracker = new Promise(async (resolve, reject) => {
    DISCORD_CLIENT.channels.fetch(`${process.env.DISCORD_CATEGORY}`, { allowUnknownGuild: true }).then(category => {
        DISCORD_CLIENT.guilds.fetch(category.guildId).then(guild => {
            guild.channels.fetch().then(async guildChannels => {
                let categoryChilds = await guildChannels.filter(channels => channels.parentId == process.env.DISCORD_CATEGORY)
                let fetchedChannel = await categoryChilds.find(c => c.name == groupChannelName)
                if (!fetchedChannel) {
                    await guild.channels.create({
                        name: groupChannelName,
                        parent: process.env.DISCORD_CATEGORY,
                        type: ChannelType.GuildText,
                        topic: "Tracking de l'activite des amis du compte du bot"
                    }).then(createdChannel => {
                        resolve(createdChannel)
                    }).catch(reason => { reject(reason) })
                } else {
                    resolve(fetchedChannel)
                }
            })
        })
    })
})



/**
 * Exports usefull discord channels (fetch or create them if needed)
 * @returns error state
 * when no errors return false
 * if error, return error
 */
module.exports.setup = Promise.all([ActivityTracker, GroupTracker]).then((result) => {
    if (result.some(r => r == undefined)) { return "ChannelSetup | At least one channel returned undefined, can't continue." }
    module.exports = {
        discordActivityChannel: result[0],
        discordGroupChannel: result[1]
    }
    return false
}).catch((err) => { return err })


