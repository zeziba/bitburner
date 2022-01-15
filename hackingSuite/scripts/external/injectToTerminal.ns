/** Given command is submitted and completed with a 'enter' key press
 * @param {string} command Terminal command 
 * @param {string} args Enter arg string with each option deliminated by a space
 */
export function terminalCommand(command, args) {
    let terminal_entry = `${command} ${args}`;
    // @ts-ignore
    const terminal = eval('document.getElementById("terminal-input")');
    terminal.value = terminal_entry;
    const handler = Object.keys(terminal)[1];
    terminal[handler].onChange({ target: terminal });
    // @ts-ignore
    terminal[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
}
