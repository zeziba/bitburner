// @ts-check
import { localeHHMMSS, scripts, settings } from "hackingSuite/common.js";
const home = "home";

/** @param {import("typings/index").NS } ns */
export async function main(ns) {
    let currenHomeRam = ns.getServerMaxRam(home);
    let customStats = `${settings(ns).baseExternalLocation}/collection-1/custom-stats.js`;
    let hacknetManger = `${settings(ns).baseExternalLocation}/collection-1/hacknetmanager.js`;
    let manager = "/hackingSuite/manager.js";

    if (currenHomeRam >= settings(ns).minRamToRun) {
        ns.tprint(`Starting hacking suite manager @ {${localeHHMMSS()}}`);
        if (!ns.scriptRunning(customStats, home)) ns.exec(customStats, home, 1, localeHHMMSS());
        if (!ns.scriptRunning(hacknetManger, home)) ns.exec(hacknetManger, home, 1, localeHHMMSS());
        if (!ns.scriptRunning(manager, home)) ns.spawn(manager, 1, localeHHMMSS());
        ns.killall(home);
    } else {
        ns.print(
            `Failed to launch as the minimum required ram to operate the full hacking suite is ${
                settings(ns).minRamToRun
            }`
        );
        ns.print("Starting low ram version until able to run full suite.");
        ns.spawn(scripts(ns).lowRamOption.lowRamOption, 1);
    }
}