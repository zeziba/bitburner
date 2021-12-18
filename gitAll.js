/**
 * @type {(string | any[])[][]}
 */
 const argsSchema = [
    ['github', 'zeziba'],
    ['repository', 'bitburner'],
    ['branch', 'main'],
    ['download', []], 
    ['new-file', []], 
];

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
    /** @type {string | any} */
    const target = ns.args[0]

    // Get the target file from github and process it
    let inputFile = ""
    /** @type {Array<string> | any} */
    let _files = []

    ns.wget(target, "ready.txt", 'home')

    for (const line in inputFile.split('\n'))
        _files.append(line)
    
    // @ts-ignore
    const options = ns.flags(argsSchema);
    const baseUrl = `https://raw.githubusercontent.com/${options.github}/${options.repository}/${options.branch}/`;
    const filesToDownload = options['new-file'].concat(_files)
    
    
    for (const localFilePath of filesToDownload) {
        const remoteFilePath = baseUrl + localFilePath.substr(options.subfolder.length);
        ns.print(`Trying to update "${localFilePath}" from ${remoteFilePath} ...`);
        if (await ns.wget(`${remoteFilePath}?ts=${new Date().getTime()}`, localFilePath))
            ns.tprint(`SUCCESS: Updated "${localFilePath}" to the latest from ${remoteFilePath}`);
        else
            ns.tprint(`WARNING: "${localFilePath}" was not updated. (Currently running or not located at ${remoteFilePath} )`)
    }
}