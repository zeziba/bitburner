/** @param {import("typings/index").NS } ns */
export async function main(ns) {
    // Disable the log
    ns.disableLog("ALL");
    
    const hook0 = eval("document.getElementById('overview-extra-hook-0')");
    const hook1 = eval("document.getElementById('overview-extra-hook-1')");
    ns.atExit(() => { hook0.innerHTML = ""; hook1.innerHTML = ""; });

    while (true) {
        try {
            const headers = [];
            const values = [];
            // Add script income per second
            headers.push("Inc: ");
            // @ts-ignore
            values.push(ns.getScriptIncome()[0].toPrecision(4) + "/sec");
            // Add script exp gain rate per second
            headers.push("Exp: ");
            // @ts-ignore
            values.push(ns.getScriptExpGain().toPrecision(4) + "/sec");
            // TODO: Add more neat stuff

            // Now drop it into the placeholder elements
            hook0.innerText = headers.join(" \n");
            hook1.innerText = values.join("\n");
        } catch (err) {
            // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(1000);
    }
}