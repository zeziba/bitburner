 /**
 * @type {(string | any[])[][] | [string, string | number | boolean | string[]][]}
 */
  const args = [
    ['github', 'zeziba'],
    ['repository', 'bitburner'],
    ['branch', 'update'],
    ['download', []], 
    ['tree_file', 'GitTheseFiles.txt']
];

const delim = "\r\n";

// @ts-ignore
export function autocomplete(data, _) {
    data.flags(args);
    return [];
}

/** Will take an argument from the terminal that is the target file location on github.
 *  This file will include all the sub files of the project to be downloaded
 *  @param {import(".").NS } ns  
 */
export async function main(ns) {
    // @ts-ignore
    const options = ns.flags(args);
    const baseUrl = `https://raw.githubusercontent.com/${options.github}/${options.repository}/${options.branch}/`;

    while (!await ns.wget(`${baseUrl}${options.tree_file}`, options.tree_file))
        await ns.sleep(1000)

    for (const line of ns.read(options.tree_file).split(delim))
        options.download.push(line);
    
    
    for (const localFilePath of options.download) {
        const remoteFilePath = `${baseUrl}${localFilePath}`;
        // Not working currently
        // ns.print(`Trying to update "${localFilePath}" from ${remoteFilePath} ...`);
        // if (await ns.wget(`${remoteFilePath}?ts=${new Date().getTime()}`, localFilePath))
        //     ns.tprint(`SUCCESS: Updated "${localFilePath}" to the latest from ${remoteFilePath}`);
        // else
        //     ns.tprint(`WARNING: "${localFilePath}" was not updated. (Currently running or not located at ${remoteFilePath} )`)
        // await ns.sleep(100)
        let terminal_entry = `wget ${remoteFilePath}?ts=${new Date().getTime()} ${localFilePath}`
        // @ts-ignore
        const terminal = eval('document.getElementById("terminal-input")')
        terminal.value=terminal_entry
        const handler = Object.keys(terminal)[1]
        terminal[handler].onChange({target:terminal});
        // @ts-ignore
        terminal[handler].onKeyDown({keyCode:13,preventDefault:()=>null});

        await ns.sleep(100)
    }
}