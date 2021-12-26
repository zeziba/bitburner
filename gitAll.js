/**
 * @type {(string | any[])[][]}
 */
 const argsSchema = [
    ['github', 'zeziba'],
    ['repository', 'bitburner'],
    ['branch', 'main'],
    ['download', []], 
    ['tree_file', 'GitTheseFiles.txt']
];

const delim = "\r\n";

// @ts-ignore
export function autocomplete(data, _) {
    data.flags(argsSchema);
    return [];
}

/** Will take an argument from the terminal that is the target file location on github.
 *  This file will include all the sub files of the project to be downloaded
 *  @param {import(".").NS } ns  
 */
export async function main(ns) {
    // @ts-ignore
    const options = ns.flags(argsSchema);
    const baseUrl = `https://raw.githubusercontent.com/${options.github}/${options.repository}/${options.branch}/`;

    ns.wget(`${baseUrl}${options.tree_file}`, "")

    for (const line in ns.read(options.tree_file).split(delim))
        options.download.push(line);
    
    
    for (const localFilePath of options.download) {
        const remoteFilePath = `${baseUrl}${localFilePath}`;
        ns.print(`Trying to update "${localFilePath}" from ${remoteFilePath} ...`);
        if (await ns.wget(`${remoteFilePath}?ts=${new Date().getTime()}`, localFilePath))
            ns.tprint(`SUCCESS: Updated "${localFilePath}" to the latest from ${remoteFilePath}`);
        else
            ns.tprint(`WARNING: "${localFilePath}" was not updated. (Currently running or not located at ${remoteFilePath} )`)
    }
}