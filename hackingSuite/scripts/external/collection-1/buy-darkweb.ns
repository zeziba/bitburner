/** @param {import("../collection-1").NS } ns */
export async function main(ns) {
    let programs = [
        { cost: 500000, program: "BruteSSH.exe" },
        { cost: 1500000, program: "FTPCrack.exe" },
        { cost: 5000000, program: "relaySMTP.exe" },
        { cost: 30000000, program: "HTTPWorm.exe" },
        { cost: 250000000, program: "SQLInject.exe" },
    ];
    // Disable the log
    ns.disableLog("ALL");

    /** Open a status window to see what is going on */
    ns.tail();

    /** Set the timeout to a amount to wait as to not hang the game */
    const timeout = 1 * 60 * 1000;

    ns.purchaseTor();

    /** Fill out pockets on the hacknet's time */
    while (true) {
        let program = programs.shift();
        if (program === undefined || !programs || !program) ns.exit(); 

        if (program.cost < ns.getPlayer().money) {
            ns.purchaseProgram(program.program);
            ns.print(`Attempting to buy ${program.program} at \$${program.cost}`);
            /** Skip placing the program back in the programs, will also start the next purchase if possible */
            continue;
        }

        programs.push(program);

        await ns.sleep(timeout);
    }
}