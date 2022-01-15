import { settings } from "hackingSuite/common.js";

/** Attempts to gain access to the target server
 * @param {import("typings/index").NS } ns
 * @param {string} target
 * @returns {boolean} Returns true if able to gain access
 *  **/
export function unlock(ns, target) {
    const hackPrograms = settings(ns).hackPrograms;

    try {
        for (const program in hackPrograms) {
            ns.print(`Attempting to ${program} at ${target}`);
            if (ns.fileExists(program, "home")) {
                // @ts-ignore
                hackPrograms[program](target);
                ns.print(`Success at ${program} at ${target}`);
            } else {
                ns.print(`Lack of ${program}`);
            }
        }

        if (!ns.hasRootAccess(target)) {
            ns.print(`Attempting to gain root at ${target}`);
            var status = ns.nuke(target);
            ns.print(`Attempt at root on ${target} ${status}`);
            return true;
        } else {
            ns.print(`Attempt at root on ${target} failed as already has root access.`);
        }
    } catch (err) {
        ns.print(`Error occured ${err} while on ${target}`);
        return false;
    }

    return false;
}