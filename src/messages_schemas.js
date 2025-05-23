const emojis = require("../src/emojis.json")
module.exports.VRCUserInfos_DiscordEmbed = (userData) => {
    userData.user.bioLinks.map(s => console.log(`[${s.split("://")[1].split("/")[0]}](${s})`))
    
    return ({
        "type": 17,
        "accent_color": 703487,
        "components": [
            {
                "type": 10,
                "content": `## Informations de [${userData.user.displayName}](https://vrchat.com/user/${userData.user.id})\n*${userData.user.id}*`
            },
            {
                "type": 10,
                "content": `${userData.user.ageVerificationStatus == "hidden" ? "Age non verifie" : userData.user.ageVerificationStatus} - ${userData.user.pronouns}`
            },
            {
                "type": 10,
                "content": `### Bio -\n\`\`\`${userData.user.bio}\`\`\``
            },
            {
                "type": 10,
                "content": `### Liens -\n \- ${userData.user.bioLinks.map(s => `[${s.split("://")[1].split("/")[0]}](${s})`).join("\n \- ")}` // afficher uniquement le domaine
            },
            {
                "type": 10,
                "content": `As rejoins VRC le ${new Date(userData.user.date_joined).toLocaleDateString()}`
            },
            {
                "type": 10,
                "content": `### Tags -\n\`\`\`\n - ${userData.user.tags.map(s => emojis.tags[s] || `${s}`).join("\n - ")}\`\`\`` // mettre les tags avec si disponnible des emojis.tags.users pour l'affichage
            },
            {
                "type": 10,
                "content": `### Badges -\n\`\`\`\n - ${userData.user.badges ? userData.user.badges.map(s => `${s.badgeName}, ${s.badgeImageUrl}`).join("\n - ") : "Aucun visible"}\`\`\``
            },
            // {
            //     "type": 12,
            //     "items": [
            //         {
            //             "media": { "url": "https://websitewithopensourceimages/coyote.png" }, // pp ou avatar ou les deux ?
            //         }
            //     ]
            // },
            {
                "type": 10,
                "content": `Derniere connection : ${new Date(userData.user.last_activity).toLocaleString()} - Cet utilisateur ${userData.user.isFriend ? "est":"n'est"} tracke par le bot`
            }
        ]
    })
} 