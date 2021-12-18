import * as common from "../common"

class Server {
    /**
     * @param {import("..").NS } ns 
     * @param {string} hostname
     */
    constructor(ns, hostname) {
        this.ns = ns
        this.hostname = hostname
        this.ram = ns.getServerMaxRam(hostname)
        /** @type {Array<string> | any} */
        this.opperations = common.basicOperations(this.ns)
    }

    get used_ram() {
        return this.ns.getServerUsedRam(this.hostname)
    }

    get available() {
        return this.ram - this.used_ram
    }

    get runningProcesses() {
        return this.ns.ps(this.hostname)
    }

    /** Returns a list of the jobs of threads running along with their targets */
    running() {
        /** @type {Array<any> | any} */

        /** @type {Array<any> | any} */
        let hacks = 0
        let grows = 0
        let weakens = 0

        for (const task of this.runningProcesses) {
            if (this.opperations.hack == task.filename)
                hacks += task.threads
            if (this.opperations.grow == task.filename)
                grows += task.threads
            if (this.opperations.weaken == task.filename)
                weakens += task.threads
        }

        return [hacks, grows, weakens]
    }

    /** Assign a task with given number of threads to this server
     * @param {'hack' | 'grow' | 'weaken'} task
     * @param {number} threads
     * @param {string} target
     * @returns {boolean}
     */
    giveTask(task, target, threads) {
        if (!(task in this.opperations))
            return false
        
        this.ns.exec(this.opperations[task], this.hostname, threads, target)
        
        return false
    }
}