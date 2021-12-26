import { convertMMSS, scripts, settings } from "../../../hacking-suite-v2/common.js";
import { unlock } from "../../../hacking-suite-v2/scripts/serverOperations/breakIn.js";

/** Class Server is an api designed to allow for access to a Server object that lets various actions happen to the server */
export class Server {
    /** Class api for the servers
     * @param {import("../../..").NS } ns
     * @param {string} hostname
     */
    constructor(ns, hostname) {
        this.ns = ns;
        this.hostname = hostname;
        this.ram = ns.getServerMaxRam(hostname);
        this.opperations = scripts(this.ns).basicOperations;
    }

    /** Shows the ram used by the server
     * @returns {number} Current Used ram
     */
    get used_ram() {
        return this.ns.getServerUsedRam(this.hostname);
    }

    /** Shows the available ram of the server
     * @returns {number} Current ram tht is usable
     */
    get available() {
        return this.ram - this.used_ram;
    }

    /** Shows all the process running on the server
     * @returns {import("../../..").ProcessInfo[]} ProcessInfo[] of all processes running on the server
     */
    get ps() {
        return this.ns.ps(this.hostname);
    }

    /** Returns a list of all the opened ports
     * @returns {string[]} List of programs that can unlock the port, only owned ones are displayed
     */
    get openedPorts() {
        let openPorts = [];
        for (const program in settings(this.ns).hackPrograms) {
            if (this.ns.fileExists(program)) openPorts.push(program);
        }

        return openPorts;
    }

    /** Shows the number of ports needed to unlock
     * @returns {number} Total number of ports needed to unlock
     */
    get neededPorts() {
        return this.ns.getServerNumPortsRequired(this.hostname);
    }

    /** Shows if server is unlockable
     * @returns {boolean} True/false if able to unlock this server
     */
    get hackable() {
        return (
            this.hasRoot &&
            this.ns.getHackingLevel() > this.ns.getServerRequiredHackingLevel(this.hostname)
        );
    }

    /** Shows the hack chance for this server
     * @returns {number} Hack chance for this server
     */
    get hackChance() {
        return this.ns.hackAnalyzeChance(this.hostname);
    }

    /** Shows if root access is on this server
     * @returns {boolean} True/false if has root access
     */
    get hasRoot() {
        return this.ns.hasRootAccess(this.hostname);
    }

    /** Shows max money this server can have
     * @returns {number} Max money this server can have
     */
    get maxMoney() {
        return this.ns.getServerMaxMoney(this.hostname);
    }

    /** Shows the current server money
     * @returns {number} Current money on server
     */
    get money() {
        return this.ns.getServerMoneyAvailable(this.hostname);
    }

    /** Shows the minimum security level this server can have
     * @returns {number} Minimum security level
     */
    get minSecLevel() {
        return this.ns.getServerMinSecurityLevel(this.hostname);
    }

    /** Shows current security level of the server
     * @returns {number} Current security level
     */
    get secLevel() {
        return this.ns.getServerSecurityLevel(this.hostname);
    }

    /** Shows a computer value for the server that takes into account the max money and security of the server
     * @returns {number} Aggrigated value to form a metric for evaluation
     */
    get value() {
        if (this.maxMoney < settings(this.ns).minAcceptableServerMoney) return 0;
        let _settings = settings(this.ns);
        return this.maxMoney * (_settings.minSecurityWeight / this.minSecLevel + this.secLevel);
    }

    /** Returns the time taken to complete 1 hack
     * @returns {number} Time taken for 1 hack
     */
    get hackTime() {
        return this.ns.getHackTime(this.hostname);
    }

    /** Get the current money in a percent of max
     * @returns {number} Current percentage of money from total
     */
    get moneyPercent() {
        return this.money / this.maxMoney;
    }

    /** Method returns the number of growth threads required to grow to the desired multiplier
     *  The given multipler is from the current monies on the server, so a 2x from $100 would
     *  result in $200 with the given number of threads
     * @param {number} multiplier
     * @returns {number} Threads required to grow server's money to requested multiplier
     */
    growthx(multiplier) {
        return this.ns.growthAnalyze(this.hostname, multiplier);
    }

    /** Method returns the number of threads to max the money of the server at the current time
     * @returns {number} Threads required to maximize money on server
     */
    getGrowthMax() {
        if (this.maxMoney <= this.money) return 0;
        return this.growthx(this.maxMoney / (this.money + Number.EPSILON));
    }

    /** Methods returns the estimated security growth from the given number of threads
     * @param {number} threads
     * @returns {number} Number of estimated security growth by opepration given thread count
     */
    growthSec(threads) {
        return this.ns.growthAnalyzeSecurity(threads);
    }

    /** Returns the amount of time a grow would take
     * @returns {number} Amount of time taken for 1 growth
     */
    get growtime() {
        return this.ns.getGrowTime(this.hostname);
    }

    /** Returns the growth multiplier for the server value 0-100
     * @returns {number} Growth multiplier between 0 - 100
     */
    get growth() {
        return this.ns.getServerGrowth(this.hostname);
    }

    /** Return the time it takes to weaken the server
     * @returns {number} Time taken to reduce the security - valid for 1 task only
     */
    get weakenTime() {
        return this.ns.getWeakenTime(this.hostname);
    }

    /** Returns the amount of threads that it will take to reduce the security back to the current value
     * @param {number} secGrowth Security that needs to be reduced
     * @returns {number} Estimated threads required to reduce the security by given amount
     */
    weakenBySecGrowth(secGrowth) {
        let weakenThreads = 1;
        while (this.ns.weakenAnalyze(weakenThreads++) < secGrowth);
        return weakenThreads;
    }

    /** Returns an array of all files on the server
     * @returns {string[]} String[] of processes currently running on this server
     */
    get ls() {
        return this.ns.ls(this.hostname);
    }

    /** Method returns the number of hack threads required to siphon off the given percentage
     * @param {number} percentage
     * @returns {number} Number of threads to gain the percentage requested
     */
    hackx(percentage) {
        return percentage / this.ns.hackAnalyze(this.hostname);
    }

    /** Method to calculate the actual number of threads required by including hack chance in calculation
     * @param {number} percentage
     * @returns {number} Number of threads required to reduce the money by the given percentage
     */
    hackPercentage(percentage) {
        if (this.hackChance > 0.5) return this.hackx(percentage);
        return Math.max(
            this.hackx(percentage) *
                (Math.log10(this.hackChance) / Math.log10(1 - this.hackChance + Number.EPSILON)),
            1
        );
    }

    /** Method returns the number of hack threads required to siphon off the given hack amount
     * @param {number} hackAmount
     * @returns {number} Number of threads estimated to hack the given amount
     */
    hackAmount(hackAmount) {
        return this.ns.hackAnalyzeThreads(this.hostname, hackAmount);
    }

    /** Method to calculate number of threads taken to reduce the servers money by given amount including the hack chance
     * @param {number} hackAmount
     * @returns {number} Number of threads estimated to hack the given amount
     */
    hackAmountActual(hackAmount) {
        if (this.hackChance > 0.5) return this.hackAmount(hackAmount);
        return (
            this.hackAmount(hackAmount) *
            (Math.log10(this.hackChance) / Math.log10(1 - this.hackChance + Number.EPSILON))
        );
    }

    /** Methods returns the estimated security growth from the given number of threads
     * @param {number} threads
     * @returns {number} Returns the estimated amound of security decrease for the given task
     */
    hackSec(threads) {
        return this.ns.hackAnalyzeSecurity(threads);
    }

    /** Returns the security decrease given the number of threads
     * @param {number} threads
     * @returns {number} Returns the estimated amound of security decrease for the given task
     */
    weakenSec(threads) {
        return this.ns.weakenAnalyze(threads);
    }

    /** Method unlock, unlock the server for use if possible
     * @returns {boolean} Returns true if able to unlock
     */
    unlock() {
        if (this.hasRoot) return true;

        let ports = this.openedPorts;
        if (ports.length < this.neededPorts) return false;

        return unlock(this.ns, this.hostname);
    }

    /** Returns a list of the jobs of threads running along with their targets
     * @returns {Array<number>} Returns the hack, grows, weakens on the current server
     */
    running() {
        /** @type {Array<any> | any} */

        /** @type {Array<any> | any} */
        let hacks = 0;
        let grows = 0;
        let weakens = 0;

        for (const task of this.ps) {
            if (this.opperations.hack == task.filename) hacks += task.threads;
            if (this.opperations.grow == task.filename) grows += task.threads;
            if (this.opperations.weaken == task.filename) weakens += task.threads;
        }

        return [hacks, grows, weakens];
    }

    /** Assign a task with given number of threads to this server
     * @param {'hack' | 'grow' | 'weaken'} task
     * @param {number} threads
     * @param {string} target
     * @returns {Promise<number>} Returns the PID of the task or 0, -1 if a non-normal execution happens
     */
    async giveTask(task, target, threads) {
        if (!(task in this.opperations)) return -1;

        return this.ns.exec(this.opperations[task], this.hostname, threads, target);
    }

    /** Method calculates maximun number of threads that the given task can complete
     * @param {string} task
     * @param {Server} target
     * @returns {number} Number of threads this server can support at max at the current time
     */
    calTaskMax(task, target) {
        return Math.floor(this.available / this.ns.getScriptRam(task, target.hostname) + Number.EPSILON)
    }

    /** Transfers the given files array to this server
     * @param {Array<string>} files
     * @param {string} source
     */
    transferFiles(files, source) {
        this.ns.scp(files, source, this.hostname);
    }

    /** Method resets the server for a fresh run */
    reset() {
        this.ns.killall(this.hostname);
    }

    /** Computes the requested number of growths, weakens and hacks for optimal use
     *  This will always attempt to reach 100% money on growth and 70% on hack
     *
     * @returns {{growThreads: number, growTime: number, hackThreads: number, hackTime: number, weakenThreads: number, weakenTime: number}} Returns the various threads and time required by each task, the time is for 1 opperation to complete
     */
    get optimalTasks() {
        let growThreads = this.getGrowthMax();
        let growTime = this.growtime;
        let weakThread = this.weakenBySecGrowth(this.growthSec(this.growtime));
        let weakTime = this.weakenTime;
        let hackThreads = this.hackPercentage(0.3);
        let hackTime = this.hackTime;

        return {
            growThreads: growThreads,
            growTime: growTime,
            hackThreads: hackThreads,
            hackTime: hackTime,
            weakenThreads: weakThread,
            weakenTime: weakTime,
        };
    }

    /** Method that calculates the maximum potenial output of the server starting from now till end of first cycle
     * @return {{EsitmatedMoneyMadeInPeriod: number, MaxMoneyPerSec: number, MoneyMadeInPeriod: number, TotalTimeTaken: number, growThreads: number, hackThreads: number, hostname: string, minCycleTime: number, weakenThreadsEnd: number, weakenThreadsStart: number}} Returns group of numbers that analyze this servers potential profit, will return false if money max is lower then threshold set in the common.settings
     */
    calculateStats() {
        /** Can use any amount of money, but by using all the monies it should be more accurate
         *  Assumption for this method will always be sequential processing as
         *  I am feeling too lazy to think about concurrent processing for it
         *
         *  Order of operations
         *      Weaken to min security
         *      Grow to max money
         *      Weaken to min security
         *      Hack till 70% max money
         *    - repeat
         *
         *  TODO: Make another function for concurrent processing for comparison
         */
        let returnValue = {
            EsitmatedMoneyMadeInPeriod: 0,
            MaxMoneyPerSec: 0,
            MoneyMadeInPeriod: 0,
            TotalTimeTaken: Infinity,
            growThreads: 0,
            hackThreads: 0,
            hostname: this.hostname,
            minCycleTime: 0,
            weakenThreadsEnd: 0,
            weakenThreadsStart: 0,
        };
        if (this.maxMoney < settings(this.ns).minAcceptableServerMoney) return returnValue;

        // Step 1. Calculate first weaken cycle
        let secToReduceFirst = this.secLevel - this.minSecLevel;
        let threadsToWeakenFirst = this.weakenBySecGrowth(secToReduceFirst);
        let timeToFirstWeaken = this.weakenTime * threadsToWeakenFirst;

        // Step 2. Grow to max money
        let growthThreads = this.getGrowthMax();
        let timeForGrowthToMax = this.growtime * growthThreads;

        // Step 3. Weaken back to min security
        let secGrowthToMax = this.growthSec(growthThreads);
        let threadsFromGrowth = this.weakenBySecGrowth(secGrowthToMax);
        let timeToReduceGrowthToMax = this.weakenTime * threadsFromGrowth;

        // Step 4. Hack till 70% money or what is in common.settings().hackCap
        let percentage = settings(this.ns).hackCap ? 0.3 : settings(this.ns).hackCap;
        let hackThreads = this.hackAmountActual(this.maxMoney * percentage);
        let timeToHackToCap = this.hackTime * hackThreads;

        // Step 5. Calcualte totals
        let totalTime =
            timeToFirstWeaken + timeForGrowthToMax + timeToReduceGrowthToMax + timeToHackToCap;
        let totalEarned =
            this.ns.hackAnalyze(this.hostname) *
            this.money *
            (hackThreads - hackThreads * (1 - this.hackChance));
        let weakenThreadsTotal = threadsToWeakenFirst + threadsFromGrowth;
        let minCycleTime = Math.min(this.hackTime, this.growtime, this.weakenTime);

        /** Multiplier to bring the money per sec into readable format  */
        let _multiplier = 1000;

        returnValue = {
            EsitmatedMoneyMadeInPeriod: Math.floor(this.maxMoney * percentage),
            MaxMoneyPerSec:
                Math.floor(((1000 * totalEarned) / totalTime) * _multiplier) / _multiplier,
            MoneyMadeInPeriod: Math.floor(totalEarned),
            TotalTimeTaken: Math.round((totalTime + Number.EPSILON) * 100) / 100,
            growThreads: Math.floor(growthThreads),
            hackThreads: Math.floor(hackThreads),
            hostname: this.hostname,
            minCycleTime: minCycleTime,
            weakenThreadsEnd: Math.floor(threadsFromGrowth),
            weakenThreadsStart: Math.floor(threadsToWeakenFirst),
        };

        return returnValue;
    }

    /** Returns a string that is the pretty pring output of the class
     * @returns {string}
     */
    get print() {
        let reval = this.calculateStats();
        return `${this.hostname}:\n\tHacking Chance: ${this.hackChance}\n\tMoney per sec: ${
            reval.MaxMoneyPerSec
        }\n\tTime Taken: ${convertMMSS(reval.TotalTimeTaken)}\n\tMoney Made In Cycle: ${
            reval.MoneyMadeInPeriod
        }\n\tGrow Threads Required: ${reval.growThreads}\n\tHack  Threads Required: ${
            reval.hackThreads
        }\n\tWeaken Threads Start Required: ${
            reval.weakenThreadsStart
        }\n\tWeaken Threads End Required: ${reval.weakenThreadsEnd}`;
    }
}

/** Will print out the given server's estimated profit, must pass the hostname
 * @param {import("../../..").NS } ns
 *  */
export async function main(ns) {
    /** @type {string | any} */
    let target = ns.args[0];
    let server = new Server(ns, target);

    ns.tprint(`${server.print}`);
    ns.tprint(
        `Max Money: ${server.maxMoney}, Money: ${server.money}, Hack Chance: ${server.hackChance}`
    );
}
