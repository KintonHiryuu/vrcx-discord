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
                "content": `## [${data.user.displayName}](https://vrchat.com/user/${data.user.id}) est connecte`
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
    })

})

VRC_WEBSOCKET.on(EventType.Friend_Offline, (data) => {
    VRC_API.userApi.getUserById({ userId: data.userId }).then(user => {


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
        })
    })
})

VRC_WEBSOCKET.on(EventType.Friend_Location, (data) => {
    if (["", /*"offline",*/ "traveling", "traveling:traveling"].includes(data.location)) { return }

    if (data.location == "offline") { console.log(`${data.user.displayName} WAITING OFFLINE`) }

    if (process.env.TEST == "true") {
        console.log(`--------------------EVENTLOCATION----------------------------`)
        console.log(data)
        console.log(`------------------------------------------------`)
    }

    if (data.location == "private") { sendMessage(data, { "private": "private" }, { "private": "private" }); return }
    VRC_API.instanceApi.getInstance({ instanceId: data.location.split(":")[1], worldId: data.world.id }).then(instance => {
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
    console.log(instanceOwner)
    discordActivityChannel.send({
        "flags": DISCORD.MessageFlags.IsComponentsV2,
        "components": [
            {
                "type": 10,
                "content": `## ${data.user.displayName}](https://vrchat.com/user/${data.user.id}) entre dans ${data?.world?.name ? `le monde ${data.world.name}` : `un monde prive`}`
            },
            {
                "type": 10,
                "content": `*Monde : ${data.world.name || "private"} par \`${data.world.authorName || "private"}\`*\n*${data.world.visits || "private"} visites pour ${data.world.favorites || "private"} favoris.*`
            },
            {
                "type": 10,
                "content": `Instance \`${instance.name || "private"}\` : ${emojis.region[instance.region] || "private"} ${emojis.InstanceType[instance.type] || instance.type || "private"} ${instance.groupAccessType ? emojis.InstanceType.groupType[instance.groupAccessType] || instance.groupAccessType : ""} - [${instanceOwner.displayName || instanceOwner.name || "private"}](https://vrchat.com/home/${instanceOwner.displayName ? "user" : "group"}/${instanceOwner.id})\n${instance.n_users || "private"}${instance.queueEnabled ? `+${instance.queueSize}` : ""}/${instance.capacity || "private"} (${instance.userCount || "private"}) | Age verifie : \`${instance.ageGate ? "Oui" : "Non"}\` | Lien de la map : [vrchat.com](https://vrchat.com/home/world/${instance.world.id}/info)`
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
            },
            {
                "type": 14,
                "divider": true,
                "spacing": 1
            }

        ]
    })
}

VRC_WEBSOCKET.on(EventType.Friend_Update, (data) => {
    if (process.env.TEST == "true") {
        console.error("update")
        console.log(data)
        console.error("fin update)")
    }
})

VRC_WEBSOCKET.on(EventType.Friend_Request, (data) => {
    discordActivityChannel.send({
        "flags": 32768,
        "components": [
            {
                "type": 10,
                "content": `## Nouvelle demande d'amis : [${data.senderUsername}](https://vrchat.com/user/${data.senderUserId})`
            },
            {
                "type": 14,
                "divider": true,
                "spacing": 1
            }

        ]
    })
    VRC_API.friendApi.sendFriendRequest({ userId: data.senderUserId }).then(r => { console.log(r) })
})


VRC_WEBSOCKET.on(EventType.Friend_Add, (data) => {
    discordActivityChannel.send({
        "flags": 32768,
        "components": [
            {
                "type": 10,
                "content": `## Nouvelle personne trackee : [${data.senderUsername}](https://vrchat.com/user/${data.senderUserId}) - ajouter les informations de la personne`
            },
            {
                "type": 14,
                "divider": true,
                "spacing": 1
            }

        ]
    })

})
