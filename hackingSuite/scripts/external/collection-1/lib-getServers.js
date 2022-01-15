/** @param {NS} ns **/

export function allServers(ns, removePurchased=true) {
	if (removePurchased) var pservs = ns.getPurchasedServers();
	const nodes = new Set;
	function dfs(node) {
		nodes.add(node);
		for (const neighbor of ns.scan(node)) {
			if (removePurchased) {
				if (!pservs.includes(neighbor)) {
					if (!nodes.has(neighbor)) {
						dfs(neighbor);
					}
				}
			} else {
				if (!nodes.has(neighbor)) {
					dfs(neighbor);
				}
			}
		}
	}
	dfs("home");
	return [...nodes];
}