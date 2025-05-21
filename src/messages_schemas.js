module.exports.VRCUserInfos_DiscordEmbed = (userData) => {
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
                "content": `\`\`\`${userData.user.bio}\`\`\``
            },
            {
                "type": 10,
                "content": `Liens de l'utilisateur :\n - ${userData.user.bioLinks.join('\n - ')}` // afficher uniquement le domaine
            },
            {
                "type": 10,
                "content": `Sur le jeux depuis ${Date(userData.user.date_joined)}` // verifier format de la date
            },
            {
                "type": 10,
                "content": `......` // mettre les tags avec si disponnible des emojis.tags.users pour l'affichage
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
                "content": "......" // last activity - isFriend
            }
        ]
    })
} 