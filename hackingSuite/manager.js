import * as common from "hackingSuite/common";
import { display } from "hackingSuite/scripts/display/manager";
import { Server } from "hackingSuite/scripts/serverOperations/server.js";

const home = "home";

/** @param {import("typings/index").NS } ns */
export async function main(ns) {
    // Create method scope settings
    const settings = common.settings(ns);

    // Disable the log
    ns.disableLog("ALL");

    // canRun will be used for the loop
    let canRun = true;

    ns.tprint(`Starting manager @ ${common.localeHHMMSS()}`);

    // Ensure this is being run from home
    if (ns.getHostname() !== "home") {
        // @ts-ignore
        throw new Exception("Run Script from Home!");
    }

    // Step 1. Init all subsystems
    // Step 1.a. Map all servers
    let servers = await setUpManager(ns);

    /**
     * Task is as follows
     *  create a queue to work from
     *  populate queue with at minimum 1 job that consist of the required threads needed to perform
     *      a given task
     *  shift off the top of the queue into a holding variable until it is consumed
     *
     *  Create a display function that display the relevant informtion from the queue
     *      including but not limited to
     *          estimated total money earned per sec
     *          estimated total money earned for the current queue
     *          total estimated durtation of the current queue items
     *
     *  Evaluate positioning for the queue based on esitmated money per sec
     *      as this takes into account the time taken it will be a good metric to
     *      use to position the servers
     *
     *  If the queue remains idle for too long, add the next more profitable server into the queue
     *      keep the last known max time taken that the queue remained empty
     *      Use the last known queue empty time to adjust downward for the next cycle
     *      If the next cycle is longer raise back upwards toward until equal to the default
     *
     * -- ABOVE IS BASED ON SEQUENTIAL MODAL! --
     *  Once a concurrent modal is made it will be appended to the end of the sequentil modal as
     *  by that point every available server will already have active work being done on it.
     *  This indicates that there is idle ram to be used to continue working on other processes.
     *
     *  Once in the concurrent modal, only the most profitiable(theoretical) server will be chosen for a given
     *  cycle. This server will be targeted with 100% of the remaining resources for explotation,
     *  as it would not make sense to target anything but this.
     */

    // Step 2. Find a target and init the target list
    let untargetedservers = [...servers];
    /**@type {Server[]} Current targets for work */
    let targets = [getTarget(untargetedservers, settings)];

    /** @type {{growStartTime: number, growThreads: number, hackStartTime: number, hackThreads: number, hostname: string, weakenStartENDTime: number, weakenStartSTARTTime: number, weakenThreadsEnd: number, weakenThreadsStart: number}[]} */
    let taskQueue = [];

    // Keep track of time having idle ram
    /** @type {number} Time from last idle */
    let idleRam = Date.now();
    /** @type {number} Number of idle ticks from last idle */
    let idleTick = 0;

    // Open a window to view stat information
    ns.tail();

    let lastServerPurchase = Date.now();

    // Step 4. Start the main loop
    while (canRun) {
        let timeNow = Date.now();
        /**@type {number} Will have to recalculate any time a new server is added into the group */
        let maxRam = calTotalMaxRam(servers);
        // Get current total ram available
        let ramReady = calTotalUsableRam(servers);

        // Populate the targets from the current targets
        // - Only if ram is idle and can handle more targets
        if (timeNow - idleRam > settings.maxIdlePeriod || idleTick > settings.maxIdleTick) {
            let ct = getTarget(untargetedservers, settings);
            untargetedservers.filter((element) => element.hostname !== ct.hostname);
            targets.push(ct);
            idleRam = timeNow;
            idleTick = 0;
        }

        // Populate Task Queue
        for (const target of targets) {
            if (!taskQueue.some((element) => element.hostname === target.hostname)) {
                taskQueue.push(createTask(target));
            }
        }

        // Consume the tasks if possible
        let i = 0;
        while (i++ < taskQueue.length) {
            let currentTask = taskQueue.shift();
            let currentTarget = targets.find(
                (element) => element.hostname === currentTask.hostname
            );

            attackTarget(ns, currentTask, servers, currentTarget);

            // Remove task if everything is fullfilled
            if (
                currentTask.hackThreads <= 0 &&
                currentTask.growThreads <= 0 &&
                currentTask.weakenThreadsEnd <= 0 &&
                currentTask.weakenThreadsStart <= 0
            ) {
                // Just skipping this part as it doesnt need to do a thing to remove the task
            } else taskQueue.push(currentTask);
        }

        // Check if ram is idle - Must be done at end of main loop
        let idleOrNot = maxRam - calTotalUsableRam(servers) < maxRam * settings.maxIdleRamPercent;
        if (idleOrNot) {
            idleTick += 1;
        } else {
            idleRam = timeNow;
            idleTick = 0;
        }

        // Buy new servers if possible
        if (timeNow - lastServerPurchase > settings.buySeverInterval) {
            let buyNewServers = `${settings.baseServerOperations}/buyNewServers.js`
            ns.exec(buyNewServers, home, 1, common.localeHHMMSS())
            lastServerPurchase = timeNow
        }

        await ns.sleep(settings.refreshInterval);
        ns.clearLog();
        ns.print(
            `${display(
                ns,
                ramReady,
                idleRam,
                idleTick,
                taskQueue.length,
                targets.length,
                servers.length,
                targets.map((element) => element.hostname),
                idleOrNot,
                settings.buySeverInterval - (timeNow - lastServerPurchase)
            )}`
        );
    }
}

/**
 * @param {import("typings/index").NS} ns
 * @param {{ growStartTime: any; growThreads: any; hackStartTime: any; hackThreads: any; hostname: any; weakenStartENDTime: any; weakenStartSTARTTime: any; weakenThreadsEnd: any; weakenThreadsStart: any; }} currentTask
 * @param {Server[]} servers
 * @param {Server} currentTarget
 */
function attackTarget(ns, currentTask, servers, currentTarget) {
    if (currentTask.weakenThreadsStart > 0) {
        currentTask.weakenThreadsStart -= giveTasksToServers(
            ns,
            servers,
            "weaken",
            currentTarget,
            currentTask.weakenThreadsStart
        );
        currentTask.weakenStartSTARTTime = Date.now();
    }
    if (currentTask.growThreads > 0) {
        currentTask.growThreads -= giveTasksToServers(
            ns,
            servers,
            "weaken",
            currentTarget,
            currentTask.growThreads
        );
        currentTask.growStartTime = Date.now();
    } else if (
        currentTask.weakenThreadsEnd > 0 &&
        Date.now() - currentTask.growStartTime >
            currentTarget.growtime * (1 - common.settings(ns).growOffset)
    ) {
        currentTask.weakenThreadsEnd -= giveTasksToServers(
            ns,
            servers,
            "weaken",
            currentTarget,
            currentTask.weakenThreadsEnd
        );
        currentTask.weakenStartENDTime = Date.now();
    } else if (currentTask.weakenThreadsEnd <= 0) {
        currentTask.hackThreads -= giveTasksToServers(
            ns,
            servers,
            "hack",
            currentTarget,
            currentTask.hackThreads
        );
        currentTask.hackStartTime = Date.now();
    }
}

/** Give tasks out to any idle server
 * @param {import("typings/index").NS } ns
 * @param {Server[]} servers
 * @param {'hack' | 'grow' | 'weaken'} task
 * @param {Server} target
 * @param {number} threads
 * @returns {number} The number of threads used by the current task assignment
 */
function giveTasksToServers(ns, servers, task, target, threads) {
    let consumedThreads = 0;
    for (const server of servers.filter((element) => element.hostname !== "home")) {
        let usedThreads = Math.min(
            threads - consumedThreads,
            server.calTaskMax(common.scripts(ns).basicOperations[task], target)
        );
        if (usedThreads <= 0) break;
        server.giveTask(task, target.hostname, usedThreads);
        consumedThreads += usedThreads;
    }
    return consumedThreads;
}

/**
 *
 * @param {import("typings/index").NS } ns
 * @returns {Promise<Server[]>} Servers that have been setup on the network and are ready to work with
 */
async function setUpManager(ns) {
    ns.tprint(`Mapping all servers @ ${common.localeHHMMSS()}`);
    mapServers(ns);

    // Step 1.b. Setup the in-memory data structure for the servers
    ns.tprint(`populating all servers into database @ ${common.localeHHMMSS()}`);
    let servers = SetUpServers(ns);

    // Step 1.c. Kill all currently running process on all servers other then home
    ns.tprint(`Killing all server processes @ ${common.localeHHMMSS()}`);
    resetServer(servers.filter((element) => element.hostname !== home));

    // Step 1.d. Unlock all servers for use
    ns.tprint(`Unlocking all possible servers @ ${common.localeHHMMSS()}`);
    unlockServers(servers);

    // Step 1.e. Transfer all files needed to the servers
    ns.tprint(`Transfering all files to target servers @ ${common.localeHHMMSS()}`);
    await transferFiles(ns, servers);
    return servers;
}

/** Function calculates the total amount of ram left in the sever group
 * @param {Server[]} servers
 * @returns {number} Total ram left to use from the server group
 */
function calTotalUsableRam(servers) {
    return servers
        .filter((element) => element.hostname !== "home")
        .filter((element) => element.hasRoot)
        .map((element) => element.available)
        .reduce((prev, curr) => prev + curr, 0);
}

/** Function calculates the total amount of ram left in the sever group
 * @param {Server[]} servers
 * @returns {number} Total ram left to use from the server group
 */
function calTotalMaxRam(servers) {
    return servers
        .filter((element) => element.hostname !== "home")
        .filter((element) => element.hasRoot)
        .map((element) => element.ram)
        .reduce((prev, curr) => prev + curr, 0);
}

/**
 * Function that creates a task object that specifies the number of sub taks to complete
 * @param {Server} server
 * @returns {{growStartTime: number, growThreads: number, hackStartTime: number, hackThreads: number, hostname: string, weakenStartENDTime: number, weakenStartSTARTTime: number, weakenThreadsEnd: number, weakenThreadsStart: number}}
 */
function createTask(server) {
    let reval = server.calculateStats();
    return {
        growStartTime: Date.now(),
        growThreads: reval.growThreads,
        hackStartTime: Date.now(),
        hackThreads: reval.hackThreads,
        hostname: reval.hostname,
        weakenStartENDTime: Date.now(),
        weakenStartSTARTTime: Date.now(),
        weakenThreadsEnd: reval.weakenThreadsEnd,
        weakenThreadsStart: reval.weakenThreadsStart,
    };
}

/** Find the most profitable server to target
 * @param {Server[]} servers
 * @param {Object.<string, any>} settings
 * @returns {Server | null} Most profitable server
 */
function getTarget(servers, settings) {
    if (!servers) return null;
    return servers
        .filter((element) => element.hostname !== "home")
        .filter((element) => element.hackable)
        .filter((element) => element.maxMoney > settings.minAcceptableServerMoney)
        .sort((a, b) => b.calculateStats().MaxMoneyPerSec - a.calculateStats().MaxMoneyPerSec)
        .shift();
}

/** Transfers files to target servers
 * @param {import("typings/index").NS } ns
 * @param {Server[]} servers
 */
async function transferFiles(ns, servers) {
    let operations = common.scripts(ns).basicOperations;
    let _files = [operations.grow, operations.hack, operations.weaken];

    for (const server of servers) {
        await server.transferFiles(_files, home);
    }
}

/** Unlocks each server possible
 * @param {Server[]} servers
 */
function unlockServers(servers) {
    servers.forEach((element) => {
        element.unlock();
    });
}

/** Resets given servers
 * @param {Server[]} servers
 */
function resetServer(servers) {
    servers.forEach((element) => {
        element.reset();
    });
}

/** Maps all servers
 *  @param {import("typings/index").NS } ns */
function mapServers(ns) {
    ns.exec(common.scripts(ns).serverOperations.mapServers, home);
}

/** Setup servers into memory
 * @param {import("typings/index").NS } ns
 * @returns {Server[]} List of Server 's that have been set up correctly
 *  */
export function SetUpServers(ns) {
    /**
     * @type {Server[]}
     */
    let servers = [];
    let serverMap = Object.keys(common.getItem(common.settings(ns).keys.serverMap).servers).forEach(
        (element) => {
            let server = new Server(ns, element);
            servers.push(server);
        }
    );
    return servers;
}
