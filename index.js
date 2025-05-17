const { RequestError, VRChatAPI, VRCWebSocket, EventType } = require('vrc-ts');
const _DISCORD = require("discord.js")

console.log("start")
const DiscordWebhook = _DISCORD.WebhookClient = new _DISCORD.WebhookClient({ url: process.env.WEBHOOK_LINK})

const api = new VRChatAPI({});
main();


// Instantiate WebSocket

async function main() {
    try {
        await api.login();
        // console.log(`Logged in successfully as ${api.currentUser.displayName}!`);
        DiscordWebhook.send({ content: `Bot connecte` })

    } catch (error) {
        if (error instanceof RequestError) {
            console.error(`Failed to login: ${error.message}`);
        } else {
            console.error(`An unexpected error occurred: ${error}`);
        }
    }
    let users = []
    for await (user of api.currentUser.friends) {
        users.push(await (await (api.userApi.getUserById({ userId: user }))).displayName)
    }
    // console.log(`Tracked : \n - ${users.join("\n - ")}`)
    DiscordWebhook.send({ content: `Amis du compte : \n \`\`\` - ${users.join("\n - ")}\`\`\`` })

    const ws = new VRCWebSocket({
        vrchatAPI: api,
        eventsToListenTo: [EventType.Friend_Location, EventType.Friend_Offline, EventType.Friend_Online],
    });

    ws.on(EventType.All, (data) => {
        console.log(`------------------------------------------------`)
        console.log(data)
        console.log(`------------------------------------------------`)
    })


    ws.on(EventType.Friend_Online, (data) => {
        console.log(`------------------------------------------------`)
        console.log(data)
        try {
            DiscordWebhook.send({ content: `${data.user.displayName} est connecte dans ${data.location}.` })
        } catch (error) {

        }

    })

    ws.on(EventType.Friend_Offline, (data) => {
        console.log(`------------------------------------------------`)
        console.log(data)
        try {
            DiscordWebhook.send({ content: `${data.user.displayName} est deconnecte.` })
        } catch (error) {

        }
    })

    ws.on(EventType.Friend_Location, (data) => {
        console.log(`------------------------------------------------`)
        console.log(data)
        try {
            DiscordWebhook.send({ content: `${data.user.displayName} est maintenant dans le monde ${data.world?.name || "prive"}` })
        } catch (error) {

        }
    })
}