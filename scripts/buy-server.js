/** @param {NS} ns **/
export async function main(_ns) {
    var ram = ns.args[0];
	var script = ns.args[1];
	
	var i = 0;
	while (i < ns.getPurchasedServerLimit()) {
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			var hostname = ns.purchaseServer("pserver-" + i, ram);
			ns.scp(script, hostname);

			// Get memory usage of script
			var mem_usage = ns.getScriptRam(script, hostname);
			var server_max = ns.getServerMaxRam(hostname);
			var server_current = ns.getServerUsedRam(hostname);
			var can_run = Math.floor((server_max - server_current) / mem_usage);

			ns.exec(script, hostname, can_run);
			
			i++;
			await ns.sleep(100);
		}
	}
}