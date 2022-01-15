import { getItem, localeHHMMSS, scripts, settings } from "hackingSuite/common.js";
import * as breakin from "hackingSuite/scripts/serverOperations/breakIn.js";

/** Will use less then 8GB of ram until the full version is unlocked at 16gb of ram
 * @param {import("typings/index").NS } ns */
export async function main(ns) {
    // Disable the log
    ns.disableLog("ALL");

    const home = "home";
    const files = [
        scripts(ns).basicOperations.grow,
        scripts(ns).basicOperations.hack,
        scripts(ns).basicOperations.weaken,
    ];

    const [head, ...tail] = ns.args;

    /**
     * The following will happen in the low ram script
     *  1. Scan all nodes within the network - use already built scanner (4.8GB)
     *  2. Target 1 server for attack till later program is unlocked
     *  3. Propagate to any server available
     *  4. Attack Target
     */
    ns.exec(scripts(ns).serverOperations.mapServers, home, 1);
    let serverMap = Object.keys(getItem(settings(ns).keys.serverMap).servers).map((element) => {
        let server = {
            data: {
                currentGrow: 0,
                currentHack: 0,
                currentWeaken: 0,
                lastAssignment: localeHHMMSS(),
                lastGrowThreads: 0,
                lastHackThreads: 0,
                lastWeakenThreads: 0,
                secGrowth: ns.getServerSecurityLevel(element),
            },
            growTime: ns.getGrowTime(element),
            growthRate: ns.getServerGrowth(element),
            hackTime: ns.getHackTime(element),
            hostname: element,
            maxMoney: ns.getServerMaxMoney(element),
            maxRam: ns.getServerMaxRam(element),
            minSec: ns.getServerMinSecurityLevel(element),
            root: ns.hasRootAccess(element),
            weakenTime: ns.getWeakenTime(element),
            ram: (/** @type {string} */ hostname) =>
                ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname),
        };
        return server;
    });

    // Gain root access to all servers where applicable
    nukeAll(ns, serverMap)

    // Find the optinal target, use growthRate * max money / sqrt(weaken time + hack time) will not reaquire
    let bestTarget = serverMap
        .map((element) => {
            return {
                host: element,
                value:
                    (element.growthRate * element.maxMoney) /
                    Math.sqrt(element.hackTime + element.weakenTime),
            };
        })
        .sort((a, b) => b.value - a.value).filter(element => ns.hasRootAccess(element.host.hostname));

    // Propagate to all know servers that can be used
    for (const server of serverMap.filter((element) => element.root)) {
        await ns.scp(files, home, server.hostname);
    }

    await ns.sleep(250);
    
    if (!bestTarget.length) {
        ns.print("Failed to find any targets, terminating")
        ns.exit()
    }
    else {
        for (const tar of bestTarget) {
            ns.print(`Target: ${tar.host.hostname}`)
        }
    }

    let timeout = settings(ns).refreshInterval; // Prevents a call each iteration of the loop
    let growCost = ns.getScriptRam(scripts(ns).basicOperations.grow);
    let hackCost = ns.getScriptRam(scripts(ns).basicOperations.hack);
    let weakenCost = ns.getScriptRam(scripts(ns).basicOperations.weaken);
    let maxCost = Math.max(growCost, hackCost, weakenCost);
    /** Ratios are in percentages from [0, 1] and the total must be 1 */
    let ratios = {
        grow: 0.7,
        hack: 0.2,
        weaken: 0.1,
    };
    // Call grow, weaken, hack on the selected server
    let target = bestTarget.shift().host;
    let growTime = ns.getGrowTime(target.hostname);
    let hackTime = ns.getHackTime(target.hostname);
    let weakenTime = ns.getWeakenTime(target.hostname);

    // Get the max time
    let maxTime = Math.max(growTime, hackTime, weakenTime);
    growTime /= maxTime;
    hackTime /= maxTime;
    weakenTime /= maxTime;

    ns.clearLog();

    // Start attack on the selected server
    while (true) {
        // Calculate ratios for grow/weaken/hack, want to over weaken as it will reduce to 0 over time
        ns.print(`Attempting to target ${target.hostname}`);
        let useableServers = serverMap
            .filter((element) => ns.hasRootAccess(element.hostname))
        for (const element of useableServers) {
                let time = localeHHMMSS();
                let totalThreads = Math.floor(element.ram(element.hostname) / maxCost);
                element.data.lastGrowThreads = Math.floor(totalThreads * ratios.grow);
                element.data.lastHackThreads = Math.floor(totalThreads * ratios.hack);
                element.data.lastWeakenThreads = Math.floor(totalThreads * ratios.weaken);
                if (element.data.lastGrowThreads)
                    ns.exec(
                        files[0],
                        element.hostname,
                        element.data.lastGrowThreads,
                        target.hostname,
                        time
                    );
                if (element.data.lastHackThreads)
                    ns.exec(
                        files[1],
                        element.hostname,
                        element.data.lastHackThreads,
                        target.hostname,
                        time
                    );
                if (element.data.lastWeakenThreads)
                    ns.exec(
                        files[2],
                        element.hostname,
                        element.data.lastHackThreads,
                        target.hostname,
                        time
                    );
                element.data.lastAssignment = time;
                element.data.secGrowth =
                    element.data.secGrowth - ns.getServerSecurityLevel(element.hostname);
                ns.print(
                    `${element.hostname} targeting ${target.hostname} with ${element.data.lastGrowThreads} grows, ${element.data.lastHackThreads} hacks, ${element.data.lastWeakenThreads} weakens`
                );
            };

        await ns.sleep(timeout);
    }
}

/**
 * @param {import("typings/index").NS} ns
 * @param {any[]} serverMap
 */
function nukeAll(ns, serverMap) {
    serverMap.forEach((element) => {
        ns.print(
            `Attempting to unlock ${element.hostname}, ${breakin.unlock(ns, element.hostname) ? "success" : "failed"}`
        )
        element.root = ns.hasRootAccess(element.hostname)
    })
}

