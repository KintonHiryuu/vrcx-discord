const { EventType } = require("vrc-ts")
const { VRC_WEBSOCKET, VRC_API } = require("../index")
const { discordActivityChannel } = require("../discord/channelsSetup")
const DISCORD = require("discord.js")
const emojis = require("../src/emojis.json")

VRC_WEBSOCKET.on(EventType.All, (data) => {
    if (process.env.TEST == true) {
        console.log(`--------------------EVENTALL----------------------------`)
        console.log(data)
        console.log(`------------------------------------------------`)
    }

})


VRC_WEBSOCKET.on(EventType.Friend_Online, (data) => {
    if (process.env.TEST == true) {
        console.log(`-----------------------EVENONLINE-------------------------`)
        console.log(data)
        console.log(`------------------------------------------------`)
    }
    discordActivityChannel.send({
        "flags": 32768,
        "components": [
            {
                "type": 10,
                "content": `## ${data.user.displayName} est connecte`
            },
            {
                "type": 10,
                "content": `*Plateforme : ${emojis.platforme[data.platform]}* | *Status : ${emojis.status[data.status]}*`
            },
            {
                "type": 14,
                "divider": true,
                "spacing": 1
            }

        ]
        //envoyer image avatar ou profilePicOverride
    }
    )
})

VRC_WEBSOCKET.on(EventType.Friend_Offline, (data) => {
    let user = VRC_API.userApi.getUserById({userId:data.userId})
    
    if (process.env.TEST == true) {
        console.log(`--------------------EVENTOFFLINE----------------------------`)
        console.log(data)
        console.log(`--------------------OFFLINEUSERDATA----------------------------`)
        console.log(user)
        console.log(`------------------------------------------------`)
    }



    discordActivityChannel.send({
        "flags": 32768,
        "components": [
            {
                "type": 10,
                "content": `## ${user.displayName} est deconnecte`
            },
            {
                "type": 14,
                "divider": true,
                "spacing": 1
            }

        ]
        //envoyer image avatar ou profilePicOverride
    }
    )
})

VRC_WEBSOCKET.on(EventType.Friend_Location, (data) => {
    if (process.env.TEST == true) {
        console.log(`--------------------EVENTLOCATION----------------------------`)
        console.log(data)
        console.log(`------------------------------------------------`)
    }
    discordActivityChannel.send({
        "flags": 32768,
        "components": [
            {
                "type": 10,
                "content": `## ${data.user.displayName} entre dans le monde ${data.world.name}`
            },
            {
                "type": 10,
                "content": `*Monde : ${data.world.name} par \`${data.world.authorName}\`*\n*${data.world.visits} visites pour ${data.world.favorites} favoris.*`
            },//ajouter worldLink et update date
            {
                "type": 10,
                "content": `Instance : \`${data.location.split(":")[1].split("~").join("\` \`")}\`* (parsing en attente)`
            },
            {
                "type": 14,
                "divider": true,
                "spacing": 1
            }

        ]
        //envoyer image monde
    }
    )

})
