/** @param {import(".").NS } ns */
export function settings(ns) {
    return {
        refreshInterval: 24 * 60 * 60 * 1000,
        minRamOnServer: 2,
        timeout: 5,
        maxAttempts: 3,
        baseLocation: "/scripts/hacking-suite-v2/",
        baseOperations: "/scripts/hacking-suite-v2/basicOperations/",
        serverOperations: "/scripts/hacking-suite-v2/serverOperations/",
        baseServer: "pserv-",
        keys: {
        serverMap: 'HS_SERVER_MAP',
        hackTarget: 'HS_SEVER_TARGETS',
        },
        hackPrograms: {
            'BruteSSH.exe': ns.brutessh,
            'FTPCrack.exe': ns.ftpcrack,
            'relaySMTP.exe': ns.relaysmtp,
            'HTTPWorm.exe': ns.httpworm,
            'SQLInject.exe': ns.sqlinject,
        }
    }
}

/** @param {import(".").NS } ns */
export function basicOperations(ns) {
    return {
        "hack": `${settings(ns).baseLocation}hack.js`,
        "grow": `${settings(ns).baseLocation}grow.js`,
        "weaken": `${settings(ns).baseLocation}weaken.js`,
    }
}
  
export function localeHHMMSS(ms = 0) {
    if (!ms) {
        ms = new Date().getTime()
    }

    return new Date(ms).toLocaleTimeString()
}
  
/**
 * @param {any} key
 */
export function getItem(key) {
    // @ts-ignore
    let item = localStorage.getItem(key);

    return item ? JSON.parse(item) : undefined;
}
  
/**
 * @param {any} key
 * @param {any} value
 */
export function setItem(key, value) {
    // @ts-ignore
    localStorage.setItem(key, JSON.stringify(value));
}
  
/** @param {import(".").NS } ns */
export async function main(ns) {
    return {
        settings,
        getItem,
        setItem,
    }
}