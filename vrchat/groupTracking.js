const { EventType } = require("vrc-ts")
const { VRC_WEBSOCKET, VRC_API } = require("../index")
const { discordGroupChannel } = require("../discord/channelsSetup")

VRC_API.notificationApi.listNotifications({type:"group.announcement"}).then(notif => console.log(notif))


VRC_WEBSOCKET.on(EventType.Group_Invite, (data) => {
    console.log(`GROUP INVITE | ${data.data.groupName} - invite par ${data.data.managerUserDisplayName}`)
    if (data.data.managerUserDisplayName == process.env.OWNER_IGN) {
        VRC_API.groupApi.joinGroup({ groupId: data.link.split(":")[1] }).then(() => {
            discordGroupChannel.send({
                "flags": 32768,
                "components": [
                    {
                        "type": 10,
                        "content": `## Groupe [${data.data.groupName}](https://vrchat.com/home/group/${data.link.split(":")[1]}) rejoins.`
                    },
                    {
                        "type": 14,
                        "divider": true,
                        "spacing": 1
                    }

                ]
            })
        }).catch(error => { console.error(`Erreur pour rejoindre le groupe ${data.data.groupName}`); console.error(error) })
    }
})


VRC_WEBSOCKET.on(EventType.Group_Announcement, (data) => {
    discordGroupChannel.send({
        "flags": 32768,
        "components": [
            {
                "type": 10,
                "content": `## Annonce de [${data.data.groupName}](https://vrchat.com/home/group/${data.data.groupId})`
            }, {
                "type": 17,
                "accent_color": 703487,
                "components": [
                    {
                        "type": 10,
                        "content": `# ${data.data.announcementTitle}`
                    },
                    {
                        "type": 10,
                        "content": `\`\`\`${data.message.replace(/```/gm, "'''")}\`\`\``
                    }
                ]
            },
            {
                "type": 14,
                "divider": true,
                "spacing": 1
            }

        ]
    }).then(() => {
        VRC_API.notificationApi.deleteNotification({notificationId:data.id})
    })
})
VRC_WEBSOCKET.on(EventType.Group_Informative, (data) => {
    console.log("----------------INFORMATION-GROUPE-------------")
    console.log(data)
    console.log("----------------------------------------------------")
})


