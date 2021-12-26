/** Common settings for the manager and other scripts to use.
 * @param {import("..").NS } ns */
export function settings(ns) {
    return {
        /** @type {string} Base Folder */
        baseLocation: "/hacking-suite-v2",
        /** @type {string} Basic operations Folder located in Base Folder / Base Scripts Folder */
        baseOperations: "/basicOperations",
        /** @type {string} Basic Scripts Base Folder */
        baseScriptsLocation: "/scripts",
        /** @type {string} Base name of player servers */
        baseServerName: "pserv-",
        /** @type {string} Basic server operations Folder located in Base Folder / Base Scripts Folder */
        baseServerOperations: "/serverOperations",
        /** @type {Object.<string, number>} Purchasable extras from the darkweb */
        darkWebExtras: {
            "DeepscanV1.exe": 500000,
            "DeepscanV2.exe": 25000000,
        },
        /** @type {Object.<string, number>} Purchasable port opening programs */
        darkwebItems: {
            "BruteSSH.exe": 500000,
            "FTPCrack.exe": 1500000,
            "HTTPWorm.exe": 30000000,
            "SQLInject.exe": 250000000,
            "relaySMTP.exe": 5000000,
        },
        /** @type {number} Offset to the grow time so that the second weaken and hack can start earlier */
        growOffset: 0.2,
        /**@type {number} Percent to cap the hack siphon to - 0.30 means 70% of max so 1-cap=0.70 */
        hackCap: 0.30,
        /** @type {Object.<string, (host: string) => void>} Programs that are used to open the server ports */
        hackPrograms: {
            "BruteSSH.exe": ns.brutessh,
            "FTPCrack.exe": ns.ftpcrack,
            "HTTPWorm.exe": ns.httpworm,
            "SQLInject.exe": ns.sqlinject,
            "relaySMTP.exe": ns.relaysmtp,
        },
        /**@type {Object.<string, string>} */
        keys: {
            /**@type {string} Server map - stored in local storage */
            serverMap: "HS_SERVER_MAP",
        },
        /**@type {number} Max time in ms that the ram can be idle */
        maxIdlePeriod: 2 * 60 * 1000,
        /**@type {number} Max percentage of ram that can be idle - setting to high can result in bugs as no server can be 100% filled */
        maxIdleRamPercent: 0.10,
        /**@type {number} Max idle ticks */
        maxIdleTick: 1000,
        /**@type {number} Minimum amount of max money a server must have to be a target */
        minAcceptableServerMoney: 60000,
        /** @type {number} Minimum ram before a player server can be purchased */
        minRamOnServer: 2,
        /**@type {number} The security weight */
        minSecurityWeight: 100,
        /**@type {number} The interval of refreshing the manager program - the main loop and display */
        refreshInterval: 100,
    };
}

/** Gives a list of all the usable scripts for the manager to use.
 * @param {import("..").NS } ns */
export function scripts(ns) {
    return {
        /** @type {Object.<string, string>} */
        basicOperations: {
            grow: `${settings(ns).baseLocation}/${settings(ns).baseScriptsLocation}/grow.js`,
            hack: `${settings(ns).baseLocation}/${settings(ns).baseScriptsLocation}/hack.js`,
            weaken: `${settings(ns).baseLocation}/${settings(ns).baseScriptsLocation}/weaken.js`,
        },
        /** @type {Object.<string, string>} */
        serverOperations: {
            buyNewServers: `${settings(ns).baseLocation}/${
                settings(ns).baseServerOperations
            }/buyNewServers.js`,
            mapServers: `${settings(ns).baseLocation}/${
                settings(ns).baseServerOperations
            }/mapServers.js`,
            serverClass: `${settings(ns).baseLocation}/${
                settings(ns).baseServerOperations
            }/server.js`,
        },
    };
}

/** Function that returns the local time or time converted from the given time in (ms)
 * @param {number} ms
 */
export function localeHHMMSS(ms = 0) {
    if (!ms) {
        ms = new Date().getTime();
    }

    return new Date(ms).toLocaleTimeString();
}

/** Function that converts ms to minutes
 * @param {number} ms
 * @returns {string} MM:SS
 */
export function convertMMSS(ms) {
    let min = Math.floor(ms / 60000)
    let secs = (Math.floor(ms % 60000) / 1000)
    return `${min}:${secs < 10 ? "0" : ""}${secs.toFixed(0)}`
}

/** Get the item from local storage.
 * @param {string} key
 */
export function getItem(key) {
    // @ts-ignore
    let item = localStorage.getItem(key);

    return item ? JSON.parse(item) : undefined;
}

/** Sets the value for the given key to local storage.
 * @param {string} key
 * @param {string | any} value
 */
export function setItem(key, value) {
    // @ts-ignore
    localStorage.setItem(key, JSON.stringify(value));
}

/** @param {import("..").NS } ns */
export async function main(ns) {
    return {
        getItem,
        setItem,
        settings,
    };
}
