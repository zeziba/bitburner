/** Will hack() on a selected server
 * @param {import("../../..").NS } ns
 * */
export async function main(ns) {
    /** @type {string | any} */
    const target = ns.args[0];

    if (!target) return;

    ns.print(`Starting hack on ${target}\n`);
    await ns.hack(target);
}
