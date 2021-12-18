import * as common from "../common.js"

/** @param {import("..").NS } ns */
export async function main(ns) {
    /** @type {string | number | boolean} */
    let target = ns.args[0]

    let portsOpened = 0
    const hp = common.settings(ns).hackPrograms

    for (const program of Object.keys(hp)) {
        if (ns.fileExists(program), 'home') {
            // @ts-ignore
            hp[program](target)
            portsOpened++
        }
    }

    // @ts-ignore
    if (ns.getServerNumPortsRequired(target) <= portsOpened) {
        if (ns.getHostname())
        // @ts-ignore
        ns.nuke(target)
        return true
    }

    return false
}