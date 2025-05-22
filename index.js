const { RequestError, VRChatAPI, VRCWebSocket, EventType } = require('vrc-ts');
const DISCORD = require("discord.js")

const DISCORD_CLIENT = new DISCORD.Client({ intents: [] })

const VRC_API = new VRChatAPI({});
main();



async function main() {
    try {
        await VRC_API.login();
    } catch (error) {
        if (error instanceof RequestError) {
            console.error(`VRC | Failed to login: ${error.message}`);
        } else {
            console.error(`VRC | An unexpected error occurred: ${error}`);
        }
        process.exit(1)
    }
    process.env.TEST == "true" ? console.log(`VRCClient online ${VRC_API.currentUser.username}`) : null;

    const VRC_WEBSOCKET = new VRCWebSocket({
        vrchatAPI: VRC_API,
        eventsToListenTo: /*[EventType.Friend_Location, EventType.Friend_Offline, EventType.Friend_Online]*/[EventType.All],
    });
    process.env.TEST == "true" ? console.log(`VRCWebSocket OK`) : null;


    DISCORD_CLIENT.login(process.env.DISCORD_TOKEN).then((c) => {
        process.env.TEST == "true" ? console.log(`DiscordClient Online : ${DISCORD_CLIENT.user.displayName}`) : null;
    })


    module.exports = { VRC_API, VRC_WEBSOCKET, DISCORD_CLIENT }
    require("./discord/channelsSetup").setup.then(() => {
        process.env.TrackingDisabled ? console.log(`Activity Tracking disabled by .env variables`) : require("./vrchat/tracking")
    })

    if(process.env.TEST == "true"){
    VRC_API.friendApi.unfriend({userId:"usr_eb895d0b-6841-4844-9b37-0fc67b6e7aef"})
}

    VRC_WEBSOCKET.on("close", ()=>{process.exit(2)})
}
