import { localeHHMMSS, settings } from "hackingSuite/common.js";

/** @param {import("typings/index").NS } ns  **/
export async function main(ns) {
    const opperations = {
        buyServer: (/** @type {string} */ name, /** @type {number} */ size) =>
            ns.purchaseServer(name, size),
        deleteServer: (/** @type {string} */ server) => ns.deleteServer(server),
        exists: (/** @type {string} */ server) => ns.serverExists(server),
        getCost: (/** @type {number} */ ram) => ns.getPurchasedServerCost(ram),
        getSize: (/** @type {string} */ server) => ns.getServerMaxRam(server),
        killAll: (/** @type {string} */ server) => ns.killall(server),
    };

    const baseServerName = settings(ns).baseServerName;

    let maxServers = ns.getPurchasedServerLimit();
    let maxSize = ns.getPurchasedServerMaxRam();
    let money = ns.getPlayer().money;
    let targetSize = 1;
    let moneyPerServer = money / maxServers;
    if (ns.getPurchasedServers().length)
        targetSize = ns.getServerMaxRam(`${ns.getPurchasedServers()[0]}`);

    while ((targetSize *= 2) <= maxSize && opperations.getCost(targetSize) < moneyPerServer);

    if (targetSize < 2) {
        ns.tprint(`Cannot affor to upgrade ram to ${targetSize}`);
        ns.exit();
    }

    let i = 0;
    ns.tprint(`Buying ${maxServers} @${targetSize}GB servers`);
    for (const server of ns.getPurchasedServers()) {
        if (opperations.exists(`${server}`)) {
            opperations.killAll(`${server}`);
            opperations.deleteServer(`${server}`);
        }
        opperations.buyServer(`${baseServerName}${i++}`, targetSize);
    }

    ns.tprint(`Completed buying ${maxServers} @ ${localeHHMMSS()}`);
}
