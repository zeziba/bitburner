/** @param {import("../collection-1").NS } ns */
export async function main(ns) {
    // Disable the log
    ns.disableLog("ALL");

    /** Set the timeout to a amount to wait as to not hang the game */
    const timeout = 1 * 60 * 1000;
    const targetUpgrade = "Sell for Money";

    /** Fill out pockets on the hacknet's time */
    while (true) {
        while (ns.hacknet.numHashes() > ns.hacknet.hashCost(targetUpgrade)) {
            let i = 0;
            ns.hacknet.spendHashes(targetUpgrade);
            ns.print(`Bought an upgrade, hashes left ${ns.hacknet.numHashes().toPrecision(4)} left`);
        }

        await ns.sleep(timeout);
    }
}