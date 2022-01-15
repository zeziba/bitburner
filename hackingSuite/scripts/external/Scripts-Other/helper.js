/**
 * Author: https://www.reddit.com/user/i3aizey/
 * Source: https://www.reddit.com/r/Bitburner/comments/9nrz3v/scan_script_v2/
 */

 let ServerType = {
    'Faction': 'Faction',
    'MoneyFarm': 'MoneyFarm',
    'Own': 'Own',
    'Shop': 'Shop',
    'Target': 'Target'
};
let getServerType = (ns, name) => {
    // Assumes all owned servers are called 'home...'
    if (name.startsWith('home'))
        return ServerType.Own;
    switch (name) {
        case 'CSEC':
        case 'I.I.I.I':
        case 'avmnite-02h':
        case 'run4theh111z':
            return ServerType.Faction;
        case 'The-Cave':
        case 'w0r1d_d43m0n':
            return ServerType.Target;
        case 'darkweb':
            return ServerType.Shop;
        default:
            return ServerType.MoneyFarm;
    }
};


export class Server {
    /**
     * @param {Ns} ns
     * @returns {Server[]}
     */
    static get(ns) {
        let visited = {'home': true};
        let servers = [];
        let queue = [new Server(ns, 'home')];
        while (queue.length > 0) {
            let curr = queue.pop();
            servers.push(curr);
            let depth = curr.depth + 1;
            ns.scan(curr.name).forEach(name => {
                if (!visited[name]) {
                    let server = new Server(ns, name, depth);
                    queue.push(server);
                    visited[name] = true;
                }
            });
        }
        return servers;
    }

    static create(ns, name) {
        return new Server(ns, name);
    }

    static types(){
        return ServerType;
    }

    /**
     * @param {Ns} ns
     * @param {string} name
     * @param {number} depth
     */
    constructor(ns, name, depth = 0) {
        this.type = getServerType(ns, name);
        this.ns = ns;
        this.name = name;
        this.depth = depth
    }

    /**
     * @returns {number}
     */
    get moneyAvail() {
        return this.ns.getServerMoneyAvailable(this.name);
    }

    /**
     * @returns {number}
     */
    get moneyMax() {
        return this.ns.getServerMaxMoney(this.name);
    }

    /**
     * @returns {boolean}
     */
    get hasMaxMoney() {
        return this.moneyAvail === this.moneyMax;
    }

    /**
     * @returns {number}
     */
    get securityMin() {
        return this.ns.getServerMinSecurityLevel(this.name);
    }

    /**
     * @returns {number}
     */
    get securityCurr() {
        return this.ns.getServerSecurityLevel(this.name);
    }

    /**
     * @returns {boolean}
     */
    get hasMinSecurity() {
        return this.securityCurr === this.securityMin;
    }

    /**
     * @returns {boolean}
     */
    get hasRoot() {
        return this.ns.hasRootAccess(this.name);
    }

    get levelNeeded() {
        return this.ns.getServerRequiredHackingLevel(this.name);
    }

    /**
     * @param {number} crackingScripts
     * @returns {boolean}
     */
    canCrack(crackingScripts) {
        if (this.hasRoot)
            return false;
        let ports = this.ns.getServerNumPortsRequired(this.name);
        if (ports > crackingScripts)
            return false;
        return this.levelNeeded <= this.ns.getHackingLevel();
    }

    /**
     * @param {string[]} availableCrackingScripts
     * @returns {boolean} success of cracking
     */
    crack(availableCrackingScripts) {
        if (this.hasRoot)
            return true;
        if (!this.canCrack(availableCrackingScripts.length))
            return false;
        availableCrackingScripts.forEach(script => {
            switch (script) {
                case 'brutessh':
                case 'brutessh.exe':
                    this.ns.brutessh(this.name);
                    break;
                case 'ftpcrack':
                case 'ftpcrack.exe':
                    this.ns.ftpcrack(this.name);
                    break;
                case 'httpworm':
                case 'httpworm.exe':
                    this.ns.httpworm(this.name);
                    break;
                case 'relaysmtp':
                case 'relaysmtp.exe':
                    this.ns.relaysmtp(this.name);
                    break;
                case 'sqlinject':
                case 'sqlinject.exe':
                    this.ns.sqlinject(this.name);
                    break;
            }
        });
        this.ns.nuke(this.name);
        return true;
    }
}