import { localeHHMMSS, setItem, settings } from "../../common.js";
// Find servers and map them to a common storage

const baseName = "home";

/** Function is a Breadth-first search
 * 		https://en.wikipedia.org/wiki/Breadth-first_search#Pseudocode
 * @param {import("../../..").NS } ns  **/
export async function main(ns) {
    /** @type {string | any} */
    var runAfter = ns.args[0];

    ns.print(`Starting to locate servers at [${localeHHMMSS()}]`);

    /** @type {string | any} */
    let hostname = ns.getHostname();
    if (hostname !== baseName) {
        // @ts-ignore
        throw new Exception(`Run script from ${baseName}`);
    }

    /** @type {Array<any> | any} */
    const serverMap = { lastUpdate: new Date().getTime(), servers: {} };
    const scanArray = [baseName];

    while (scanArray.length) {
        // Get the first entry from scanArry while shifting it off
        const host = scanArray.shift();
        ns.print(`Scanning from ${host}`);

        // Populate the host found in the serverMap
        serverMap.servers[host] = {
            files: ns.ls(host),
            growth: ns.getServerGrowth(host),
            hackignLevel: ns.getServerRequiredHackingLevel(host),
            hackingLevel: ns.getServerRequiredHackingLevel(host),
            host: host,
            maxMoney: ns.getServerMaxMoney(host),
            minSecurityLevel: ns.getServerMinSecurityLevel(host),
            ports: ns.getServerNumPortsRequired(host),
            ram: ns.getServerMaxRam(host),
        };

        // Get the connects to current host
        const connections = ns.scan(host) || [baseName];
        serverMap.servers[host].connections = connections;

        // Push all the hosts found to the scanArray
        connections
            .filter((hostname) => !serverMap.servers[hostname])
            .forEach((hostname) => scanArray.push(hostname));
    }

    let hasAllParents = false;

    // Go through all hosts and set up the associations
    while (!hasAllParents) {
        hasAllParents = true;

        // Create an object that sorts the connections for the host
        Object.keys(serverMap.servers).forEach((hostname) => {
            // Get the current host
            const server = serverMap.servers[hostname];

            if (!server.parent) hasAllParents = false;

            // If current host is the home node then set it up
            if (hostname === baseName) {
                server.parent = baseName;
                server.children = server.children ? server.children : [];
            }

            // Set up the bought servers, if name is not started with 'psver-' then change
            if (hostname.includes(settings(ns).baseServerName)) {
                server.parent = baseName;
                server.children = [];

                if (serverMap.servers[server.parent].children) {
                    serverMap.servers[server.parent].children.push(hostname);
                } else {
                    serverMap.servers[server.parent].children = [hostname];
                }
            }

            // If the current host has not had it's parent found then do so
            if (!server.parent) {
                // If the connections of the current node is 1 then create the paths due to this
                if (server.connections.length === 1) {
                    server.parent = server.connections[0];
                    server.children = [];

                    if (serverMap.servers[server.parent].children) {
                        serverMap.servers[server.parent].children.push(hostname);
                    } else {
                        serverMap.servers[server.parent].children = [hostname];
                    }
                }
                // Create node connection if the connections if not equal to 1
                else {
                    // If there is a lack of children nodes create an empty list
                    if (!server.children) {
                        server.children = [];
                    }

                    // Create and locate the children nodes
                    if (server.children.length) {
                        const parent = server.connections.filter(
                            (/** @type {string} */ hostname) => !server.children.includes(hostname)
                        );

                        if (parent.length === 1) {
                            server.parent = parent.shift();

                            if (serverMap.servers[server.parent].children) {
                                serverMap.servers[server.parent].children.push(hostname);
                            } else {
                                serverMap.servers[server.parent].children = [hostname];
                            }
                        }
                    }
                }
            }
        });
    }

    ns.print(`Finished locating servers at [${localeHHMMSS()}]`);
    setItem(settings(ns).keys.serverMap, serverMap);

    if (runAfter) {
        try {
            ns.spawn(runAfter, 1);
        } catch (err) {
            ns.print(`Error occured ${err} while on ${runAfter}\n`);
            return err;
        }
    }
}
