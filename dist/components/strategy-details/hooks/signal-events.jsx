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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSignalEvents = void 0;
var data_hook_1 = require("../../../hooks/data.hook");
var calculations_1 = require("../../../utils/calculations");
var toEvents = function (v) {
    return v.reduce(function (acc, _a) {
        var _b;
        var time = _a.time;
        return (__assign(__assign({}, acc), (_b = {}, _b[time] = true, _b)));
    }, {});
};
var useSignalEvents = function (strategy, r) {
    var source = (0, data_hook_1.useRows)("source").rows;
    if ((strategy === null || strategy === void 0 ? void 0 : strategy.openSignal) && (strategy === null || strategy === void 0 ? void 0 : strategy.closeSignal)) {
        var _a = (0, calculations_1.applySignal)(r || source)(strategy === null || strategy === void 0 ? void 0 : strategy.openSignal), open_1 = _a.data, openBars = _a.bars;
        var _b = (0, calculations_1.applySignal)(r || source)(strategy === null || strategy === void 0 ? void 0 : strategy.closeSignal), close_1 = _b.data, closeBars = _b.bars;
        return {
            open: toEvents(open_1),
            close: toEvents(close_1),
            openBars: openBars,
            closeBars: closeBars,
        };
    }
    return { open: {}, close: {}, openBars: [], closeBars: [] };
};
exports.useSignalEvents = useSignalEvents;
