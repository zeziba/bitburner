import * as common from "hackingSuite/common"
import { convertMMSS, localeHHMMSS } from "hackingSuite/common"

/**
 * @param {import("typings/index").NS} ns
 * @param {number} ramReady
 * @param {number} idleRam
 * @param {number} idleTick
 * @param {number} taskQueue
 * @param {number} targetLength
 * @param {number} serverLength
 * @param {string[]} targets
 * @param {boolean} idleOrNot
 * @param {number} serverTillPurchase
 * @returns {string} String of what to display on the screen
 */
export function display(ns, ramReady, idleRam, idleTick, taskQueue, targetLength, serverLength, targets, idleOrNot, serverTillPurchase) {
    return `
-----------------------
Ram Usable: ${ramReady}
Total Servers: ${serverLength}
Idle Ram: ${localeHHMMSS(idleRam)}
Idle Tick: ${idleTick}
Task Queue Length: ${taskQueue}
Targets Total: ${targetLength}
Targets: ${targets.toString()}
Is Idle: ${idleOrNot}
Purchase In Servers: ${convertMMSS(serverTillPurchase)}
-----------------------
    `
}