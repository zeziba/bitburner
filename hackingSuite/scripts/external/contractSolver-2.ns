/** @param {NS} ns **/
function algorithmicStockTrader1(ns, data) {
    if (data.length == 0) {
        return 0;
    }
    var chances = findProfitChances(data);
    var mergedChances = mergeChances(chances);
    var profit = Math.max(...mergedChances.map((cs) => Math.max(...cs.map((c) => c[1] - c[0]))));
    return profit;
}

/** @param {NS} ns **/
function algorithmicStockTrader2(ns, data) {
    if (data.length == 0) {
        return 0;
    }
    var chances = findProfitChances(data);
    var profit = chances.map((c) => c[1] - c[0]).reduce((a, b) => a + b, 0);
    return profit;
}

/** @param {NS} ns **/
function algorithmicStockTrader3(ns, data) {
    if (data.length == 0) {
        return 0;
    }
    var chances = findProfitChances(data);
    // var mergedChances = mergeChances(chances);
    // var mp = mergedChances.map(cs=>cs.map(c=>c[1]-c[0]));
    return maxProfit(chances, 2);
}

/** @param {NS} ns **/
function algorithmicStockTrader4(ns, data) {
    if (data[1].length == 0) {
        return 0;
    }
    var chances = findProfitChances(data[1]);
    // var mergedChances = mergeChances(chances);
    // var mp = mergedChances.map(cs=>cs.map(c=>c[1]-c[0]));
    return maxProfit(chances, data[0]);
}

function maxProfit(chances, k) {
    if (k == 0 || chances.length == 0) {
        return 0;
    }
    var c0 = chances[0];
    if (chances.length == 1) {
        return c0[1] - c0[0];
    }
    var profit = maxProfit(chances.slice(1), k);
    for (var i = 0; i < chances.length; i++) {
        var p = chances[1] - chances[0][0] + maxProfit(chances.slice(i + 1), k - 1);
        if (p > profit) {
            profit = p;
        }
    }
    return profit;
}

function findProfitChances(data) {
    var start = data[0];
    var end = start;
    var chances = [];
    for (var i = 1; i < data.length; i++) {
        var now = data;
        if (end < now) {
            end = now;
        }
        if (end > now) {
            if (end > start) {
                chances.push([start, end]);
            }
            start = now;
            end = start;
        }
    }
    if (end > start) {
        chances.push([start, end]);
    }
    return chances;
}

function mergeChances(chances) {
    var n = chances.length;
    var mc = [];
    var cs = chances.slice();
    mc.push(cs);
    while (cs.length > 1) {
        var ncs = [];
        for (var i = 0; i < cs.length - 1; i++) {
            ncs.push([cs[i][0], cs[i + 1][1]]);
        }
        mc.push(ncs);
        cs = ncs;
    }
    mc.reverse();
    return mc;
}

/** @param {NS} ns **/
function minPathSumInTriangle(ns, data) {
    var length = data.length;
    if (length == 1) {
        return data[0][0];
    }
    var r = data[length - 1].slice();
    for (var i = length - 2; i >= 0; i--) {
        var row = data;
        var nr = [];
        for (var j = 0; j < i + 1; j++) {
            nr.push(Math.min(r[j] + row[j], r[j + 1] + row[j]));
        }
        r = nr;
    }
    return r[0];
}

/** @param {NS} ns **/
function largestPrimeFactor(ns, data) {
    var factor = 0;
    var k = data;
    var rk = Math.sqrt(k);
    for (var i = 2; i < rk; ) {
        if (k % i == 0) {
            factor = i;
            k /= i;
            rk = Math.sqrt(k);
        } else {
            i++;
        }
    }
    if (k > factor) {
        factor = k;
    }
    return factor;
}

function uniquePathInGrid1(ns, data) {
    var a = data[0];
    var b = data[1];
    if (a > b) {
        a = data[1];
        b = data[0];
    }
    a = a - 1;
    b = b - 1;
    var n = a + b;

    var c = 1;
    for (var i = 1; i <= a; i++) {
        c = (c * n) / i;
        n--;
    }
    return c;
}

function spiralizeMatrix(ns, data) {
    var s = 0;
    var m = [];
    for (var i = 0; i < data.length; i++) {
        m.push(data.slice());
    }
    var a = [];
    while (m.length > 0 && m[0].length > 0) {
        switch (s) {
            case 0:
                a = a.concat(m[0]);
                m = m.slice(1);
                s = 1;
                break;
            case 1:
                for (var i = 0; i < m.length; i++) {
                    a.push(m.pop());
                }
                s = 2;
                break;
            case 2:
                a = a.concat(m.pop().reverse());
                s = 3;
                break;
            case 3:
                for (var i = m.length - 1; i >= 0; i--) {
                    a.push(m[0]);
                    m = m.slice(1);
                }
                s = 0;
                break;
        }
    }
    return a;
}

function totalWayToSum(ns, data) {
    var cache = {};
    var n = data;
    return twts(n, n, cache) - 1;
}

function twts(limit, n, cache) {
    if (n < 1) {
        return 1;
    }
    if (limit == 1) {
        return 1;
    }
    if (n < limit) {
        return twts(n, n, cache);
    }
    if (n in cache) {
        var c = cache[n];
        if (limit in c) {
            return c[limit];
        }
    }
    var s = 0;
    for (var i = 1; i <= limit; i++) {
        s += twts(i, n - i, cache);
    }
    if (!(n in cache)) {
        cache[n] = {};
    }
    cache[n][limit] = s;
    return s;
}
