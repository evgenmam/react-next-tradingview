"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyTakeProfit = exports.strategyStats = exports.getRoi = exports.withRunningTotal = exports.calculateStrategy = exports.applyStrategy = exports.applySignal = exports.mergeMatches = void 0;
var material_1 = require("@mui/material");
var R = __importStar(require("ramda"));
var number_utils_1 = require("./number.utils");
var D = __importStar(require("date-fns"));
var is = function (v) { return (!!v ? 1 : 0); };
var anyIs = function (v) { return (v.some(is) ? 1 : 0); };
var allAre = function (v) { return (v.every(is) ? 1 : 0); };
var addRangeGap = function (range) { return function (l) {
    return R.concat(R.repeat(0, range))(l);
}; };
var listToRanges = function (range) { return function (l) { return R.aperture(range + 1)(l); }; };
var arrayToRanges = function (range) {
    return R.pipe(addRangeGap(range), listToRanges(range));
};
var arraysToRanges = function (range) {
    return R.pipe(R.map(arrayToRanges(range)), R.transpose);
};
var checkRanges = function (ranges) {
    var a = ranges.map(function (r) { return r.every(function (l) { return anyIs(l); }); });
    return a;
};
var cleanConcurrent = function (range) { return function (keys) {
    return keys.map(function (k, i, arr) {
        return +(R.none(function (v) { return !!v; }, arr.slice(R.clamp(0, Infinity, i - range), i)) && k);
    });
}; };
var mergeMatches = function (matches, range, operator) {
    if (range === void 0) { range = 0; }
    if (operator === void 0) { operator = "AND"; }
    if (operator === "OR") {
        var a = R.transpose(matches).map(function (p) { return +p.some(is); });
        return a;
    }
    var b = R.pipe(arraysToRanges(range), checkRanges, cleanConcurrent(range))(matches);
    return b;
};
exports.mergeMatches = mergeMatches;
var findMatches = function (rows, signal) {
    var _a;
    var m = signal.condition
        .map(function (c) {
        var conds = rows.map(function (r, i) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            var result = false;
            var idx = i;
            var secondIdx = idx - ((c === null || c === void 0 ? void 0 : c.a.field) === ((_a = c === null || c === void 0 ? void 0 : c.b) === null || _a === void 0 ? void 0 : _a.field) ? 1 : 0);
            var a = (_b = rows[idx]) === null || _b === void 0 ? void 0 : _b[c.a.field];
            var b = ((_c = c.b) === null || _c === void 0 ? void 0 : _c.type) === "number" ? c === null || c === void 0 ? void 0 : c.b.value : (_d = rows[secondIdx]) === null || _d === void 0 ? void 0 : _d[(_e = c.b) === null || _e === void 0 ? void 0 : _e.field];
            var prevA = (_f = rows[idx - 1]) === null || _f === void 0 ? void 0 : _f[c.a.field];
            var prevB = ((_g = c.b) === null || _g === void 0 ? void 0 : _g.type) === "number"
                ? c === null || c === void 0 ? void 0 : c.b.value
                : (_h = rows[secondIdx - 1]) === null || _h === void 0 ? void 0 : _h[(_j = c.b) === null || _j === void 0 ? void 0 : _j.field];
            if (c.operator === "true") {
                result = !!a;
            }
            if (a && b)
                switch (c.operator) {
                    case "equals":
                        result = a === b;
                        break;
                    case "greater":
                        result = a > b;
                        break;
                    case "greaterOrEqual":
                        result = a >= b;
                        break;
                    case "less":
                        result = a < b;
                        break;
                    case "lessOrEqual":
                        result = a <= b;
                        break;
                    case "notEqual":
                        result = a !== b;
                        break;
                    case "crossesUp":
                        result = !!prevA && !!prevB && prevA < prevB && a > b;
                        break;
                    case "crossesDown":
                        result = !!prevA && !!prevB && prevA > prevB && a < b;
                        break;
                    default:
                        result = false;
                }
            return +result;
        });
        return {
            conds: conds,
            next: c.next,
            offset: c.offset,
        };
    })
        .reduce(function (cond1, _a) {
        var conds = _a.conds, _b = _a.offset, offset = _b === void 0 ? 0 : _b, next = _a.next;
        return ({
            conds: conds.map(function (c, i) {
                var _a, _b, _c, _d;
                return cond1.next === "OR"
                    ? c ||
                        +((_b = (_a = cond1.conds).filter) === null || _b === void 0 ? void 0 : _b.call(_a, function (_, j) { return j >= i - offset && j <= i; }).some(function (v) { return !!v; }))
                    : c &&
                        +((_d = (_c = cond1.conds).filter) === null || _d === void 0 ? void 0 : _d.call(_c, function (_, j) { return j >= i - offset && j <= i; }).some(function (v) { return !!v; }));
            }),
            next: next,
            offset: offset,
        });
    }, {
        conds: Array(rows.length).fill(1),
        next: "AND",
        offset: 0,
    }).conds;
    if ((_a = signal.link) === null || _a === void 0 ? void 0 : _a.signal) {
        var link = findMatches(rows, signal.link.signal);
        var ma = (0, exports.mergeMatches)([m, link], signal.link.range, signal.link.operator);
        return ma;
    }
    return m;
};
var applySignal = function (rows) { return function (signal) {
    var matches = findMatches(rows, signal);
    var bars = matches.reduce(function (a, v, i) { return (v ? __spreadArray(__spreadArray([], a, true), [matches.length - i - 1], false) : a); }, []);
    var data = rows.filter(function (v, i) { return matches[i]; });
    return {
        data: data,
        signal: signal,
        bars: bars,
    };
}; };
exports.applySignal = applySignal;
var applyStrategy = function (rows) {
    return function (strategy) { return ({
        open: (0, exports.applySignal)(rows)(strategy.openSignal).data.map(function (r) { return ({
            strategy: strategy,
            open: true,
            long: strategy.direction === "long",
            short: strategy.direction === "short",
            time: r.time,
            action: "open",
        }); }),
        close: (0, exports.applySignal)(rows)(strategy.closeSignal).data.map(function (r) { return ({
            strategy: strategy,
            close: true,
            long: strategy.direction === "long",
            short: strategy.direction === "short",
            time: r.time,
            action: "close",
        }); }),
    }); };
};
exports.applyStrategy = applyStrategy;
var calculateStrategy = function (source, target) {
    return function (strategy) {
        var signals = {
            open: (0, exports.applySignal)(source)(strategy.openSignal).data.map(function (r) { return ({
                time: r.time,
                action: "open",
            }); }),
            close: (0, exports.applySignal)(source)(strategy.closeSignal).data.map(function (r) { return ({
                time: r.time,
                action: "close",
            }); }),
        };
        var trades = signals.open
            .map(function (o) {
            var _a;
            return ({
                strategy: strategy,
                opened: o.time,
                closed: (_a = signals.close.find(function (c) { return c.time > o.time; })) === null || _a === void 0 ? void 0 : _a.time,
            });
        })
            .map(function (t) {
            var _a, _b;
            return (__assign(__assign({}, t), { highest: t.closed &&
                    ((_a = target
                        .filter(function (r) { return r.time >= t.opened && r.time <= (t.closed || Infinity); })
                        .map(function (r) {
                        return r;
                    })
                        .reduce(function (a, b) { return (a.high > b.high ? a : b); }, { high: 0, time: 0 })) === null || _a === void 0 ? void 0 : _a.time), lowest: (_b = target
                    .filter(function (r) { return r.time >= t.opened && r.time <= (t.closed || Infinity); })
                    .reduce(function (a, b) { return (a.low < b.low ? a : b); }, {
                    low: Infinity,
                    time: 0,
                })) === null || _b === void 0 ? void 0 : _b.time }));
        })
            .map(function (t) {
            var _a, _b, _c, _d;
            return (__assign(__assign({}, t), { count: strategy.entry, short: strategy.direction === "short", duration: t.closed ? t.closed - t.opened : undefined, openPrice: (_a = target.find(function (r) { return r.time > t.opened; })) === null || _a === void 0 ? void 0 : _a.close, closePrice: (_b = target.find(function (r) { return r.time > (t.closed || Infinity); })) === null || _b === void 0 ? void 0 : _b.close, highestPrice: (_c = target.find(function (r) { return r.time > (t.highest || Infinity); })) === null || _c === void 0 ? void 0 : _c.high, lowestPrice: (_d = target.find(function (r) { return r.time > (t.lowest || Infinity); })) === null || _d === void 0 ? void 0 : _d.low }));
        })
            .map(function (v) { return (__assign(__assign({}, v), { pnl: v.closePrice && v.openPrice
                ? +((v.closePrice - v.openPrice) * (v.short ? -1 : 1)).toFixed(2)
                : 0, runup: v.highestPrice && v.openPrice
                ? +((v.highestPrice - v.openPrice) * (v.short ? -1 : 1)).toFixed(2)
                : 0, drawdown: v.lowestPrice && v.openPrice
                ? +((v.lowestPrice - v.openPrice) * (v.short ? -1 : 1)).toFixed(2)
                : 0 })); })
            .map(function (v) { return (__assign(__assign({}, v), { color: v.pnl
                ? v.pnl > 0
                    ? material_1.colors.green[500]
                    : material_1.colors.red[500]
                : "grey", pnlRate: +((v.pnl && v.openPrice ? v.pnl / v.openPrice : 0) * 100).toFixed(2), drawdownRate: +((v.drawdown && v.openPrice ? v.drawdown / v.openPrice : 0) * 100).toFixed(2), runupRate: +((v.runup && v.openPrice ? v.runup / v.openPrice : 0) * 100).toFixed(2), totalIn: v.openPrice * ((v === null || v === void 0 ? void 0 : v.count) || 1), totalOut: v.closePrice ? v.closePrice * ((v === null || v === void 0 ? void 0 : v.count) || 1) : 0 })); });
        return trades;
    };
};
exports.calculateStrategy = calculateStrategy;
var withRunningTotal = function (rows) {
    var totalPnl = 0;
    return rows.map(function (r) { return (__assign(__assign({}, r), { totalPnl: +(totalPnl += r.pnl || 0).toFixed(2) })); });
};
exports.withRunningTotal = withRunningTotal;
var getTotalN = function (key) {
    return R.pipe(R.map(R.propOr(0, key)), R.sum);
};
var getTotal = function (key) { return R.pipe(getTotalN(key), number_utils_1.cur); };
var countBy = function (pred, key) {
    return R.pipe(R.filter(R.propSatisfies(pred, key)), R.length);
};
var toInterval = function (t) { return ({
    start: t.opened,
    end: t.closed === Infinity || !t.closed ? new Date() : t.closed,
}); };
var isOverlapping = function (a, b) {
    return D.areIntervalsOverlapping(toInterval(a), toInterval(b));
};
var getIntersection = function (a, b) { return (__assign(__assign({}, a), { opened: Math.max(a.opened, b.opened), closed: Math.min(a.closed || Infinity, b.closed || Infinity), openPrice: a.openPrice + b.openPrice })); };
var getMaxIn = function (v) {
    return v
        .map(function (t, i) {
        return v
            .slice(i + 1)
            .reduce(function (acc, b) { return (isOverlapping(acc, b) ? getIntersection(acc, b) : acc); }, t);
    })
        .map(function (v) { return v.openPrice * (v.count || 1); })
        .reduce(R.max, 0);
};
var getRoi = function (v) {
    return R.converge(R.divide, [getTotalN("pnl"), getMaxIn])(v);
};
exports.getRoi = getRoi;
exports.strategyStats = R.applySpec({
    totalTrades: R.length,
    winningTrades: countBy(function (pnl) { return +pnl > 0; }, "pnl"),
    losingTrades: countBy(function (pnl) { return +pnl < 0; }, "pnl"),
    openTrades: countBy(function (closed) { return !closed; }, "closed"),
    totalPnl: getTotal("pnl"),
    totalIn: getTotal("totalIn"),
    totalOut: getTotal("totalOut"),
    maxIn: R.pipe(getMaxIn, number_utils_1.cur),
    roi: R.pipe(exports.getRoi, number_utils_1.per),
});
var applyTakeProfit = function (takeProfit) { };
exports.applyTakeProfit = applyTakeProfit;
