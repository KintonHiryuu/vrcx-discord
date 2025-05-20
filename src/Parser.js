/**
 * @typedef {instanceDetails}
 * @property {String} worldID ID du monde de l'instance
 * @property {String} instanceID ID de l'instance
 * @property {String} region Region de l'instance
 * @example usw use eu jp
 * @property {String} type Type d'ouverture de l'instance
 * @example Publique, Friends, FriendsPlus, Invite, InvitePlus, Group, GroupPlus, GroupPublic

/**
 * 
 * @param {string} worldlink Lien sans modification de la map 
 * @example worldId=wrld_ba913a96-fac4-4048-a062-9aa5db092812&instanceId=12345~private(usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469)~canRequestInvite~region(use)~nonce(9033d4ab-5b5c-48b2-f018-73e663d82212) 
 * @returns {instanceDetails} instanceDetail = {worldID, instanceID, region, type}
 */
module.exports.VRCInstances = (worldlink) => {
    let instanceDetails = {worldID:'',instanceID:'',region:'',type:''}
    instanceDetails.worldID = worldlink.split(':')[0]
    worldlink = worldlink.split(':')[1]

    for (detail of worldlink.split("~")) {
        if (detail == worldlink.split("~")[0]) {
            instanceDetails.instanceID = detail
            continue
        }
        if (detail.startsWith("region(")) {
            if(detail.toLowerCase().endsWith("(us)")){
                instanceDetails.region = "usw"
            }else if(detail.toLowerCase().endsWith("(use)")){
                instanceDetails.region = "use"
            } else if(detail.toLowerCase().endsWith("(eu)")){
                instanceDetails.region = "eu"
            } else if(detail.toLowerCase().endsWith("(jp)")){
                instanceDetails.region = "jp"
            }
            continue
        }
        if (detail.startsWith("hidden")) {
            instanceDetails.type = "FriendsPlus"
            continue
        }
        if (detail.startsWith("friends")) {
            instanceDetails.type = "Friends"
            continue
        }
        if (detail.startsWith("private") && !instanceDetails.type) {
            instanceDetails.type = "Invite"
            continue
        }
        if (detail == "canRequestInvite") {
            instanceDetails.type = "InvitePlus"
            continue
        }
        if (detail.startsWith("groupAccessType")) {
            if (detail.endsWith("(public)")) {
                instanceDetails.type = "GroupPublic"
            } else if (detail.endsWith("(plus)")) {
                instanceDetails.type = "GroupPlus"
            } else if (detail.endsWith("(members)")) {
                instanceDetails.type = "Group"
            }
            continue
        }
    }
    if (!instanceDetails.type) instanceDetails.type = "Publique"

    return instanceDetails
}