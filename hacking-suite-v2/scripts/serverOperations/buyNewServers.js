import {localeHHMMSS, settings} from "../../common.js"

/** @param {import("../../..").NS } ns  **/
export async function main(ns) {
    const opperations = {
        buyServer: (/** @type {string} */ name, /** @type {number} */ size) => ns.purchaseServer(name, size),
        deleteServer: (/** @type {string} */ server) => ns.deleteServer(server),
        exists: (/** @type {string} */ server) => ns.serverExists(server),
        getCost: (/** @type {number} */ ram) => ns.getPurchasedServerCost(ram),
        getSize: (/** @type {string} */ server) => ns.getServerMaxRam(server),
        killAll: (/** @type {string} */ server) => ns.killall(server),
    }

    const baseServerName = settings(ns).baseServerName;

	let maxServers = ns.getPurchasedServerLimit();
	let maxSize = ns.getPurchasedServerMaxRam();
	let money = ns.getPlayer().money;
    let targetSize = 1;
    let moneyPerServer = money / maxServers;
	if (ns.serverExists(`${baseServerName}0`))
		targetSize = ns.getServerMaxRam(`${baseServerName}0`);

    while ((targetSize *= 2) <= maxSize && opperations.getCost(targetSize) < moneyPerServer);

    if (targetSize < 2) {
        ns.tprint(`Cannot affor to upgrade ram to ${targetSize}`);
        ns.exit();
    }

    ns.tprint(`Buying ${maxServers} @${targetSize}GB servers`)
    for (let i = 0; i < maxServers; i++) {
        if (opperations.exists(`${baseServerName}${i}`)) { 
            opperations.killAll(`${baseServerName}${i}`);
            opperations.deleteServer(`${baseServerName}${i}`);
        }
        opperations.buyServer(`${baseServerName}${i}`, targetSize);
    }

    ns.tprint(`Completed buying ${maxServers} @ ${localeHHMMSS()}`)
}