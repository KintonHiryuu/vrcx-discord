const { EventType } = require("vrc-ts")
const { VRC_WEBSOCKET, VRC_API } = require("../index")
const { discordActivityChannel } = require("../discord/channelsSetup")
const DISCORD = require("discord.js")
const emojis = require("../src/emojis.json")

VRC_WEBSOCKET.on(EventType.All, (data) => {
    if (process.env.TEST == "true") {
        console.log(`--------------------EVENTALL----------------------------`)
        console.log(data)
        console.log(`------------------------------------------------`)
    }

})


VRC_WEBSOCKET.on(EventType.Friend_Online, (data) => {
    if (process.env.TEST == "true") {
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
                "content": `*Plateforme : ${emojis.platforme[data.platform] || data.platform}* | *Status : ${emojis.status[data.user.status] || data.user.status}*`
            },
            {
                "type": 12,
                "items": [
                    {
                        "media": {
                            "url": data.user.profilePicOverrideThumbnail || data.user.currentAvatarThumbnailImageUrl || undefined
                        }
                    }
                ]
            },
            {
                "type": 14,
                "divider": true,
                "spacing": 1
            }

        ]
        //envoyer image avatar ou profilePicOverride
    })

})

VRC_WEBSOCKET.on(EventType.Friend_Offline, (data) => {
    let user = VRC_API.userApi.getUserById({ userId: data.userId })

    if (process.env.TEST == "true") {
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
    if (["", "offline", "traveling", "traveling:traveling"].includes(data.location)) { return }

    if (process.env.TEST == "true") {
        console.log(`--------------------EVENTLOCATION----------------------------`)
        console.log(data)
        console.log(`------------------------------------------------`)
    }

    if(data.location == "private") {sendMessage(data,{"private":"private"},{"private":"private"});return}
    VRC_API.instanceApi.getInstance({ instanceId: data.location.split(":")[1], worldId: data.world.id }).then(instance => {
        console.log(instance.type)
        console.log(instance.ownerId)
        if (instance.type == "group") {
            VRC_API.groupApi.getGroupbyID({ groupId: instance.ownerId }).then(instanceOwner => {
                sendMessage(data, instance, instanceOwner)
            })
        } else {
            VRC_API.userApi.getUserById({ userId: instance.ownerId || instance.world.authorId }).then(instanceOwner => {
                sendMessage(data, instance, instanceOwner)
            })
        }


    })

})

/**
 * @private
 * @param {Object} data websocket event data
 * @param {Object} instance instance data
 * @param {Object} instanceOwner user or group data
 * @returns {void}
 */
function sendMessage(data, instance, instanceOwner) {
    discordActivityChannel.send({
        "flags": DISCORD.MessageFlags.IsComponentsV2,
        "components": [
            {
                "type": 10,
                "content": `## ${data.user.displayName} entre dans ${data?.world?.name ? `le monde ${data.world.name}`:`un monde prive`}`
            },
            {
                "type": 10,
                "content": `*Monde : ${data.world.name || "private"} par \`${data.world.authorName || "private"}\`*\n*${data.world.visits || "private"} visites pour ${data.world.favorites || "private"} favoris.*`
            },
            {
                "type": 10,
                "content": `Instance \`${instance.name || "private"}\` : ${emojis.region[instance.region]|| "private"} ${emojis.InstanceType[instance.type] || instance.type || "private"} ${instance.groupAccessType ? emojis.InstanceType.groupType[instance.groupAccessType] || instance.groupAccessType : ""} - [${instanceOwner.displayName || instanceOwner.name || "private"}](https://vrchat.com/home/${instanceOwner.displayName?"user":"group"}${instanceOwner.Id})\n${instance.n_users || "private"}${instance.queueEnabled ? `+${instance.queueSize}` : ""}/${instance.capacity || "private"} (${instance.userCount || "private"}) | Age verifie : \`${instance.ageGate ? "Oui" : "Non"}\` | Lien : [vrchat.com](https://vrchat.com/home/launch?worldId=${instance.world.id}&${instance.instanceId})`
            },
            {
                "type": 12,
                "items": [
                    {
                        "media": {
                            "url": data.user.profilePicOverrideThumbnail || data.user.currentAvatarThumbnailImageUrl || undefined
                        },
                        "media": {
                            "url": data.world.imageUrl || undefined
                        }
                    }
                ]
            }

        ]
    })
}