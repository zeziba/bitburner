const _filename = 'downgrade.js'
const home = 'home'

/** Will use the lowest amount of ram possible to hack and attack it's neighbors
 * @param {import("..").NS } ns */
export async function main(ns) {
    scp(ns, "n00dles")
}

/**
 * @param {import("..").NS } ns
 * @param {string} dest
 */
function scp(ns, dest) {
    terminalCommand("scp", `${_filename} ${home} ${dest}`)
}


// Is a copy of the function from the scripts - needed for 1 file transfers
/** Given command is submitted and completed with a 'enter' key press
 * @param {string} command Terminal command 
 * @param {string} args Enter arg string with each option deliminated by a space
 */
 export function terminalCommand(command, args) {
    let terminal_entry = `${command} ${args}        `;
    // @ts-ignore
    const terminal = eval('document.getElementById("terminal-input")');
    terminal.value = terminal_entry;
    const handler = Object.keys(terminal)[1];
    terminal[handler].onChange({ target: terminal });
    // @ts-ignore
    terminal[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
}