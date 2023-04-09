"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TVScriptParser = exports.script = exports.getTrades = void 0;
var getTrades = function (data) {
    var _a, _b;
    if (data === void 0) { data = []; }
    var trades = [];
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var row = data_1[_i];
        trades.push([
            (_a = row.strategy) === null || _a === void 0 ? void 0 : _a.open,
            row.action === "long",
            row.contracts || 1,
            (row === null || row === void 0 ? void 0 : row.closed) && ((_b = row === null || row === void 0 ? void 0 : row.strategy) === null || _b === void 0 ? void 0 : _b.close),
        ]
            .filter(function (v) { return !!v; })
            .join(","));
    }
    return trades.map(function (v) { return "s.new(".concat(v, ")"); }).join(",");
};
exports.getTrades = getTrades;
var script = function (rows, _a) {
    var _b;
    var dataset = _a.dataset, source = _a.source, strategy = _a.strategy;
    return "//@version=5\nstrategy(\"BG:".concat(strategy === null || strategy === void 0 ? void 0 : strategy.id, ":").concat(dataset || "", " [").concat(source || "", "][").concat(((_b = strategy === null || strategy === void 0 ? void 0 : strategy.direction) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || "", "]\", overlay=true, margin_long=100, margin_short=100)\ntype s\n    int ot\n    bool l\n    float n\n    int ct\n\ntimes = array.from(").concat(rows, ")\n\nfor t in times\n    n = t.l ? 'LONG' : 'SHORT'\n    if (time == t.ot)    \n        strategy.entry(n, t.l ? strategy.long : strategy.short, t.n)\n    if (time == t.ct)\n        strategy.close(n)\n");
};
exports.script = script;
var TVScriptParser = /** @class */ (function () {
    function TVScriptParser(_a) {
        var trades = _a.trades, strategy = _a.strategy, dataset = _a.dataset, source = _a.source;
        this.trades = trades;
        this.strategy = strategy;
        this.dataset = dataset;
        this.source = source;
    }
    TVScriptParser.prototype.scriptFromTrades = function () {
        return (0, exports.script)((0, exports.getTrades)(this.trades), this);
    };
    return TVScriptParser;
}());
exports.TVScriptParser = TVScriptParser;
