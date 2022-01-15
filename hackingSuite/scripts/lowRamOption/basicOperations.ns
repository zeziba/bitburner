const timeout = 100;
const header = `
/** Written by automation tool alpha.1
 * @param {import("typings/index").NS } ns
 * /
`;
const functionCall = `export function main(ns)`;
const body = `
    ns.disableLog("ALL");
    while (true)
`;
const closer = `ns.sleep(${timeout})`;
const footer = ``;

function _grow() {
    return `
    ${header}
    ${functionCall} {
        ${body} {
            ns.grow();
        }
    }
    ${footer}
    `;
}

function _hack() {
    return `
    ${header}
    ${functionCall} {
        ${body} {
            ns.hack();
        }
    }
    ${footer}
    `;
}

function _weaken() {
    return `
    ${header}
    ${functionCall} {
        ${body} {
            ns.weaken();
        }
    }
    ${footer}
    `;
}

/** @param {import("typings/index").NS } ns */
export async function main(ns) {
    ns.disableLog("ALL");

    const growLocation = "hackingSuite/scripts/lowRamOption/grow.js"
    const hackLocation = "hackingSuite/scripts/lowRamOption/grow.js"
    const weakenLocation = "hackingSuite/scripts/lowRamOption/grow.js"

    // Write all the above files
    await ns.write(growLocation, _grow().split(`\n`), "w")
    await ns.write(hackLocation, _hack().split(`\n`), "w")
    await ns.write(weakenLocation, _weaken().split(`\n`), "w")

    ns.print(`Finished writing all scripts`)
}