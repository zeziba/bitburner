/** @param {NS} ns **/
import {allServers} from "./lib-getServers.js";

export async function main(ns) {
	var approved = [];
	var deniedhack = [];
	var deniedports = [];
	var denied = [];
	var other = [];
	var files = [0, 0, 0, 0, 0];
	var maxPorts = 0;

	//suppress all default log messages
	ns.tail(); ns.disableLog('ALL'); ns.clearLog();

	//check for help argument.
	if (ns.args.includes("-h")) {help(ns); return;}
	ns.print("For script help use argument '-h' ");
	
	ns.print("Executing...");
	
	//process argument calls
	var target = [];
	if (ns.args.length > 0) {
		if (ns.args[0] === "-s") {
			target = await allServers(ns);
		} else {
			target = ns.args;
		}
	} else {
		target = await allServers(ns);
	}

	//check max ports available to open
	if (ns.fileExists("BruteSSH.exe"))  {files[0] = 1; maxPorts++; ns.print("BruteSSH.exe file exists");}  else {ns.print("BruteSSH.exe not found");}
	if (ns.fileExists("FTPCrack.exe"))  {files[1] = 1; maxPorts++; ns.print("FTPCrack.exe file exists");}  else {ns.print("FTPCrack.exe not found");}
	if (ns.fileExists("relaySMTP.exe")) {files[2] = 1; maxPorts++; ns.print("relaySMTP.exe file exists");} else {ns.print("relaySMTP.exe not found");}
	if (ns.fileExists("HTTPWorm.exe"))  {files[3] = 1; maxPorts++; ns.print("HTTPWorm.exe file exists");}  else {ns.print("HTTPWorm.exe not found");}
	if (ns.fileExists("SQLInject.exe")) {files[4] = 1; maxPorts++; ns.print("SQLInject.exe file exists");} else {ns.print("SQLInject.exe not found");}
	ns.print("Maximum ports able to open: [" + maxPorts + "]\n");

	//open all ports and attempt root access
	for (const n of target) {
		if (ns.serverExists(n)) {
			const serverHackLvl = ns.getServerRequiredHackingLevel(n);
			const playerHackingLvl = ns.getHackingLevel();
			
			if (playerHackingLvl >= serverHackLvl) {
				if (files[0]) { ns.brutessh(n); }
				if (files[1]) { ns.ftpcrack(n); }
				if (files[2]) { ns.relaysmtp(n);}
				if (files[3]) { ns.httpworm(n); }
				if (files[4]) { ns.sqlinject(n);}

				gainRootAccess(n, maxPorts, approved, deniedports, denied, other, ns);

			} else {
				denied.push(n);
				deniedhack.push("[DENIED] - hack level too low [" + playerHackingLvl + '/' + serverHackLvl + "] for " + n);
			}
		}
	}

	//output results
	if (deniedhack.length>0) ns.print(deniedhack.join("\n"));
	if (deniedports.length>0) ns.print(deniedports.join("\n"));
	if (other.length>0) ns.print("[ALREADY ACQUIRED ROOT ACCESS] for " + other.join("\n[ALREADY ACQUIRED ROOT ACCESS] for "));
	if (approved.length>0) ns.print("[ROOT ACCESS APPROVED] for " + approved.join("\n[ROOT ACCESS APPROVED] for "));

	if (ns.args.includes("-s")) {
		ns.print("Copiable list of rooted servers:\n" + approved.join(" ") + other.join(" "));
	}
}

function gainRootAccess(server, portCount, approved, deniedports, denied, other, ns) {
	if (!ns.hasRootAccess(server)) {
		if (portCount >= ns.getServerNumPortsRequired(server)) {
			ns.nuke(server);
			approved.push(server);
		} else {
			denied.push(server);
			deniedports.push("[ROOT ACCESS DENIED] for " + server + " - Not enough open PORTS");
		}
	} else {
		other.push(server);
	}
}

function help(ns) {
	const text = [
		"<========================HELP=====================>\n",
		"- Script takes in [N] arguments or none at all.",
		"  [N]: server names that you wish to be rooted.",
		"  e.g.: run rootAccessor.ns n00dles joesguns zer0\n",
		"- No args will attempt root access on all servers\n",
		"- include argument '-s' as an argument to print",
		"  copiable list of all rooted servers\n",
		"<=================================================>"
		];
	ns.print(text.join("\n"));
}