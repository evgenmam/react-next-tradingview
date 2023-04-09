"use strict";
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
exports.useStrategyTrades = void 0;
var R = __importStar(require("ramda"));
var number_utils_1 = require("../../../utils/number.utils");
var settings_hook_1 = require("../../../hooks/settings.hook");
var D = __importStar(require("date-fns"));
var uuid_1 = require("uuid");
var toInterval = function (t) {
    var _a, _b;
    return ({
        start: (_a = t.open) === null || _a === void 0 ? void 0 : _a.time,
        end: ((_b = t === null || t === void 0 ? void 0 : t.close) === null || _b === void 0 ? void 0 : _b.time) || new Date(),
    });
};
var isOverlapping = R.curry(function (a, b) {
    return D.areIntervalsOverlapping(toInterval(a), toInterval(b));
});
var applyTakeProfit = function (v, takeProfit) {
    var tpPrice = (0, number_utils_1.addPercent)(takeProfit)(v[0].open);
    var index = R.findIndex(function (c) { return c.high > tpPrice; })(v);
    return R.take(index + 2)(v);
};
var applyStopLoss = function (v, stopLoss) {
    var tpPrice = (0, number_utils_1.addPercent)(stopLoss)(v[0].open);
    var index = R.findIndex(function (c) { return c.low < tpPrice; })(v);
    return R.take(index + 2)(v);
};
var hasTp = function (v, tp) {
    return !!tp && !!R.find(function (c) { return c.high > (0, number_utils_1.addPercent)(tp)(v[0].open); })(v);
};
var hasSl = function (v, sl) {
    return (!!sl && !!R.find(function (c) { return c.low < (0, number_utils_1.subPercent)(sl)(v[0].open); })(v));
};
var useStrategyTrades = function (_a, rows, strategy, tp, sl) {
    var openBars = _a.openBars, closeBars = _a.closeBars;
    if (rows === void 0) { rows = []; }
    var c = (0, settings_hook_1.useSettings)();
    var trades = openBars.reduce(function (v, openBarIdx) {
        var _a, _b, _c, _d, _e, _f;
        if (!rows.at(-openBarIdx))
            return v;
        var openPrice = (0, number_utils_1.val)(rows.at(-openBarIdx).open);
        var closeBarIdx = closeBars.find(function (c) { return c < openBarIdx; });
        var closed = !!closeBarIdx;
        var allBars = rows.slice(-openBarIdx, closeBarIdx && -closeBarIdx + 1);
        var bars = __spreadArray([], allBars, true);
        if (!bars.length)
            return v;
        if (hasSl(allBars, sl))
            bars = applyStopLoss(allBars, sl);
        if (hasTp(allBars, tp))
            bars = applyTakeProfit(allBars, tp);
        var high = bars.reduce(R.maxBy(R.propOr(0, "high")), bars[0]);
        var low = bars.reduce(R.minBy(R.propOr(Infinity, "low")), bars[0]);
        var closePrice = (0, number_utils_1.val)((!closed ? (_a = bars.at(-1)) === null || _a === void 0 ? void 0 : _a.close : (_b = bars.at(-1)) === null || _b === void 0 ? void 0 : _b.open) || 0);
        var openTotal = (0, number_utils_1.val)((strategy === null || strategy === void 0 ? void 0 : strategy.usd) || ((strategy === null || strategy === void 0 ? void 0 : strategy.entry) || 1) * openPrice);
        var contracts = (0, number_utils_1.val)((strategy === null || strategy === void 0 ? void 0 : strategy.usd) ? openTotal / openPrice : (strategy === null || strategy === void 0 ? void 0 : strategy.entry) || 1);
        var pnl = (0, number_utils_1.val)((0, number_utils_1.val)(contracts * closePrice) - openTotal) *
            ((strategy === null || strategy === void 0 ? void 0 : strategy.direction) === "short" ? -1 : 1);
        var closeTotal = openTotal + pnl;
        var symbol = (_e = (_d = (_c = c[strategy === null || strategy === void 0 ? void 0 : strategy.dataset]) === null || _c === void 0 ? void 0 : _c.split) === null || _d === void 0 ? void 0 : _d.call(_c, ":")) === null || _e === void 0 ? void 0 : _e[1];
        var openTime = new Date(bars[0].time);
        var cc = (_f = bars.at(-1)) === null || _f === void 0 ? void 0 : _f.time;
        var closeTime = cc ? new Date(cc) : new Date();
        var overlapping = v.filter(isOverlapping({
            open: bars[0],
            close: bars.at(-1),
            openTotal: openTotal,
            openPrice: openPrice,
            action: (strategy === null || strategy === void 0 ? void 0 : strategy.direction) || "long",
        }));
        if (!rows.at(-openBarIdx - 1))
            return v;
        var trade = {
            id: (0, uuid_1.v4)(),
            close: bars.at(-1),
            closed: !!closed,
            closePrice: closePrice,
            closeTotal: closeTotal,
            contracts: contracts,
            diff: D.formatDistanceStrict(openTime, closeTime),
            high: high,
            length: bars.length,
            low: low,
            open: bars[0],
            openPrice: openPrice,
            openTotal: openTotal,
            pnl: {
                value: pnl,
                percent: +(pnl / openTotal).toFixed(4),
                cumulative: v.reduce(function (a, b) { var _a; return a + (((_a = b.pnl) === null || _a === void 0 ? void 0 : _a.value) || 0); }, pnl),
            },
            volume: "".concat(contracts, " ").concat(symbol),
            symbol: symbol,
            openTrades: overlapping.length + 1,
            invested: (0, number_utils_1.val)(overlapping.map(function (t) { return t.openTotal; }).reduce(function (a, b) { return a + b; }, openTotal)),
            action: (strategy === null || strategy === void 0 ? void 0 : strategy.direction) || "long",
            strategy: {
                open: bars.at(0).time,
                close: closed ? bars.at(-1).time : undefined,
            },
            takeProfitTriggered: hasTp(allBars, tp),
            stopLossTriggered: hasSl(allBars, sl),
            takeProfit: tp && (0, number_utils_1.addPercent)(tp)(bars[0].open),
            stopLoss: sl && (0, number_utils_1.subPercent)(sl)(bars[0].open),
        };
        return __spreadArray(__spreadArray([], v, true), [trade], false);
    }, []);
    return trades;
};
exports.useStrategyTrades = useStrategyTrades;
