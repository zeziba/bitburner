/** @param {NS} ns **/
export async function main(ns) {
    solveContract(ns, ns.args[0], ns.args[1], 1);
}

export function solveContract(ns, host, filename, logLevel = 0) {
    var type = ns.codingcontract.getContractType(filename, host);
    var desc = ns.codingcontract.getDescription(filename, host);
    var data = ns.codingcontract.getData(filename, host);
    ns.tprint(host + " " + filename);
    ns.tprint(type);
    if (logLevel >= 1) {
        ns.tprint(desc);
        ns.tprint(data);
    }
    var answer;
    switch (type) {
        case "Minimum Path Sum in a Triangle":
            answer = minPathSumInTriangle(ns, data);
            break;
        case "Find Largest Prime Factor":
            answer = largestPrimeFactor(ns, data);
            break;
        case "Unique Paths in a Grid I":
            answer = uniquePathInGrid1(ns, data);
            break;
        case "Unique Paths in a Grid II":
            answer = uniquePathInGrid2(ns, data);
            break;
        case "Spiralize Matrix":
            answer = spiralizeMatrix(ns, data);
            break;
        case "Total Ways to Sum":
            answer = totalWayToSum(ns, data);
            break;
        case "Algorithmic Stock Trader I":
            answer = algorithmicStockTrader1(ns, data);
            break;
        case "Algorithmic Stock Trader II":
            answer = algorithmicStockTrader2(ns, data);
            break;
        case "Algorithmic Stock Trader III":
            answer = algorithmicStockTrader3(ns, data);
            break;
        case "Algorithmic Stock Trader IV":
            answer = algorithmicStockTrader4(ns, data);
            break;
        case "Array Jumping Game":
            answer = arrayJumpingGame(ns, data);
            break;
        case "Subarray with Maximum Sum":
            answer = subarrayWithMaxSum(ns, data);
            break;
        case "Generate IP Addresses":
            answer = generateIpAddresses(ns, data);
            break;
        case "Merge Overlapping Intervals":
            answer = mergeOverlappingIntervals(ns, data);
            break;
        case "Find All Valid Math Expressions":
            answer = findAllValidMathExpr(ns, data);
            break;
        case "Sanitize Parentheses in Expression":
            answer = sanitizeParentheses(ns, data);
            break;
            ns.tprint("unsupported type: " + type);
            return;
        default:
            ns.tprint("unknown type: " + type);
            return;
    }
    if (answer && !(answer instanceof String) && Object.keys(answer).length > 20) {
        ns.tprint("answer size too large to print: " + Object.keys(answer).length);
    } else {
        ns.tprint(answer);
    }
    var opts = {};
    opts.returnReward = true;
    var reward = ns.codingcontract.attempt(answer, filename, host, opts);
    if (reward) {
        ns.tprint(reward);
    } else {
        ns.tprint("failed!");
    }
}

/** @param {NS} ns **/
function sanitizeParentheses(ns, data) {
    var context = { maxLeftLength: 0 };
    var exprs = findSanitized(ns, data, 0, context);
    exprs = exprs.filter((e) => e.length >= context["maxLeftLength"]).sort();
    for (var i = 0; i < exprs.length - 1; i++) {
        while (exprs == exprs[i + 1]) {
            exprs.splice(i + 1, 1);
        }
    }
    return exprs;
}

function findSanitized(ns, s, pos, context) {
    // ns.tprint(s, " ", pos, " ", context["maxLeftLength"], " ", validateParentheses(s));
    if (s.length < context["maxLeftLength"]) {
        return [];
    }

    if (pos == s.length) {
        if (validateParentheses(s)) {
            if (s.length > context["maxLeftLength"]) {
                context["maxLeftLength"] = s.length;
            }
            return [s];
        } else {
            return [];
        }
    }

    var results = [];
    var c = s[pos];
    if (c == "(" || c == ")") {
        results = results.concat(
            findSanitized(ns, s, pos + 1, context),
            findSanitized(ns, s.slice(0, pos) + s.slice(pos + 1), pos, context)
        );
    } else {
        results = results.concat(findSanitized(ns, s, pos + 1, context));
    }
    return results;
}

function validateParentheses(s) {
    var n = 0;
    for (var i = 0; i < s.length; i++) {
        if (s == "(") {
            n++;
        }
        if (s == ")") {
            n--;
        }
        if (n < 0) {
            return false;
        }
    }
    return n == 0;
}

/** @param {NS} ns **/
function findAllValidMathExpr(ns, data) {
    var s = data[0];
    var n = data[1];
    return findExpr(s, n, "");
}

function findExpr(s, n, expr) {
    if (s.length == 0) {
        if (eval(expr) == n) {
            return [expr];
        } else {
            return [];
        }
    }

    var results = [];
    if (s.startsWith("0")) {
        var sliced = s.slice(1);
        if (expr.length == 0) {
            return findExpr(sliced, n, expr + "0");
        }
        results = results.concat(
            findExpr(sliced, n, expr + "+0"),
            findExpr(sliced, n, expr + "-0"),
            findExpr(sliced, n, expr + "*0")
        );
        return results;
    }

    var maxLength = s.length;
    var ops = [];
    if (expr.length == 0) {
        ops = ["", "-"];
    } else {
        ops = ["-", "+", "*"];
    }
    for (var op of ops) {
        for (var i = 1; i <= maxLength; i++) {
            results = results.concat(findExpr(s.slice(i), n, expr + op + s.slice(0, i)));
        }
    }
    return results;
}

/** @param {NS} ns **/
function mergeOverlappingIntervals(ns, data) {
    var intervals = data.slice();
    for (var i = 0; i < intervals.length; i++) {
        for (var j = i + 1; j < intervals.length; ) {
            var merged = mergeInterval(intervals, intervals[j]);
            if (merged !== null) {
                intervals = merged;
                intervals.splice(j, 1);
                j = i + 1;
            } else {
                j++;
            }
        }
    }
    intervals.sort((a, b) => a[0] - b[0]);
    return intervals;
}

function mergeInterval(a, b) {
    if (a[1] < b[0] || a[0] > b[1]) {
        return null;
    }
    return [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
}

/** @param {NS} ns **/
function generateIpAddresses(ns, data) {
    return parseIpNum(ns, data, []);
}

/** @param {String} s
 * @Param {Array} parts**/
function parseIpNum(ns, s, parts) {
    if (parts.length == 4) {
        if (s.length == 0) {
            return [parts[0] + "." + parts[1] + "." + parts[2] + "." + parts[3]];
        } else {
            return [];
        }
    }
    if (s.length == 0) {
        return [];
    }
    var results = [];
    if (s.startsWith("0")) {
        parts.push(0);
        results = parseIpNum(ns, s.slice(1), parts);
        parts.pop();
        return results;
    }
    for (var i = 1; i <= 3 && i <= s.length; i++) {
        var n = parseInt(s.slice(0, i));
        if (n > 255) {
            break;
        }
        parts.push(n);
        results = results.concat(parseIpNum(ns, s.slice(i), parts));
        parts.pop();
    }
    return results;
}

/** @param {NS} ns **/
function uniquePathInGrid2(ns, data) {
    var maxY = data.length;
    var maxX = data[0].length;
    var c = Array(maxY);
    for (var y = 0; y < maxY; y++) {
        var row = data[y];
        c[y] = Array(maxX);
        for (var x = 0; x < row.length; x++) {
            var s = 0;
            if (row[x] == 0) {
                if (x == 0 && y == 0) {
                    s = 1;
                }
                if (y > 0) {
                    s += c[y - 1][x];
                }
                if (x > 0) {
                    s += c[y][x - 1];
                }
            }
            c[y][x] = s;
        }
    }
    return c[maxY - 1][maxX - 1];
}

function countPathInGrid(data, x, y) {
    var obstacle = data[y][x];
    if (obstacle == 1) {
        return 0;
    }
    if (x == data[y].length - 1 && y == data.length) {
        return 1;
    }
    var count = 0;
    if (x < data[y].length - 1) {
        count += countPathInGrid(data, x + 1, y);
    }
    if (y < data.length - 1) {
        count += countPathInGrid(data, x, y + 1);
    }
}

/** @param {NS} ns **/
function subarrayWithMaxSum(ns, data) {
    return findMaxSubArraySum(data);
}

function findMaxSubArraySum(arr) {
    if (arr.length == 0) {
        return 0;
    }
    if (arr.length == 1) {
        return arr[0];
    }
    var sum = findMaxSubArraySum(arr.slice(1));
    var s = 0;
    for (var i = 0; i < arr.length; i++) {
        s += arr;
        if (s > sum) {
            sum = s;
        }
    }
    return sum;
}

/** @param {NS} ns **/
function arrayJumpingGame(ns, data) {
    return findJump(data, 0);
}

function findJump(data, pos) {
    var maxJump = data[pos];
    if (pos + maxJump >= data.length - 1) {
        return 1;
    }
    for (var i = 1; i <= maxJump; i++) {
        if (findJump(data, pos + i) == 1) {
            return 1;
        }
    }
    return 0;
}
