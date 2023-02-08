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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TvAPIWorker = void 0;
var uuid_1 = require("uuid");
var tradingview_1 = __importDefault(require("../tradingview"));
var utils_1 = require("../utils");
var tv_client_1 = __importDefault(require("./tv-client"));
var client = new tv_client_1.default();
var splits = function (symbol) {
    return "=".concat(JSON.stringify({
        adjustment: "splits",
        symbol: symbol,
    }));
};
var TvAPIWorker = /** @class */ (function () {
    function TvAPIWorker() {
        var _this = this;
        this.init = function () { return __awaiter(_this, void 0, void 0, function () {
            var results, chartprops;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tradingview_1.default.login()];
                    case 1:
                        results = _c.sent();
                        chartprops = JSON.parse((_b = (_a = results === null || results === void 0 ? void 0 : results.user) === null || _a === void 0 ? void 0 : _a.settings) === null || _b === void 0 ? void 0 : _b.chartproperties);
                        return [4 /*yield*/, client.init(results.user.auth_token)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, client.send("set_locale", ["en", "US"])];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, client.send("chart_create_session", [this.chartSession])];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, client.send("switch_timezone", [
                                this.chartSession,
                                chartprops === null || chartprops === void 0 ? void 0 : chartprops.timezone,
                            ])];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, client.send("quote_create_session", [this.quoteSession])];
                    case 6:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.getSymbolData = function (_a) {
            var symbol = _a.symbol, _b = _a.indicators, indicators = _b === void 0 ? [] : _b;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var symbol_id, series_id;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client.listen("timescale_update", function (data) {
                                var _a, _b, _c;
                                var d = data[1];
                                try {
                                    resolve((_c = Object.values((_b = (_a = Object.values(d)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.s)) === null || _c === void 0 ? void 0 : _c.map(function (_a) {
                                        var v = _a.v;
                                        return ({
                                            time: v[0] * 1000,
                                            open: v[1],
                                            high: v[2],
                                            low: v[3],
                                            close: v[4],
                                            volume: v[5],
                                            dataset: symbol,
                                        });
                                    }));
                                }
                                catch (error) {
                                    reject(error);
                                }
                            });
                            return [4 /*yield*/, this.addQuote(symbol)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.resolveSymbol(symbol)];
                        case 2:
                            symbol_id = _a.sent();
                            return [4 /*yield*/, this.createSeries(symbol_id)];
                        case 3:
                            series_id = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        this.getIndicatorData = function (_a) {
            var symbol = _a.symbol, indicator = _a.indicator;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var symbol_id, series_id, fields;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.addQuote(symbol)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.resolveSymbol(symbol)];
                        case 2:
                            symbol_id = _a.sent();
                            return [4 /*yield*/, this.createSeries(symbol_id)];
                        case 3:
                            series_id = _a.sent();
                            return [4 /*yield*/, this.addIndicator(series_id, indicator)];
                        case 4:
                            fields = _a.sent();
                            client.listen("du", function (data) {
                                var _a, _b, _c;
                                var d = data[1];
                                try {
                                    resolve((_c = Object.values((_b = (_a = Object.values(d)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.st)) === null || _c === void 0 ? void 0 : _c.map(function (_a) {
                                        var v = _a.v;
                                        return (__assign({ time: v[0] * 1000 }, fields
                                            .map(function (f, i) {
                                            var _a;
                                            return (_a = {}, _a[f] = v[i + 1], _a);
                                        })
                                            .reduce(function (a, b) { return (__assign(__assign({}, a), b)); }, {})));
                                    }));
                                }
                                catch (error) {
                                    reject(error);
                                }
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        this.addQuote = function (symbol) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.send("quote_add_symbols", [this.quoteSession, symbol])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.resolveSymbol = function (symbol, symbol_id) { return __awaiter(_this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = symbol_id || (0, uuid_1.v4)();
                        return [4 /*yield*/, client.send("resolve_symbol", [this.chartSession, id, symbol])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, id];
                }
            });
        }); };
        this.createSeries = function (symbol_id, series_id, interval, count) {
            if (interval === void 0) { interval = "1W"; }
            if (count === void 0) { count = 300; }
            return __awaiter(_this, void 0, void 0, function () {
                var s_id;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            s_id = series_id || (0, uuid_1.v4)();
                            return [4 /*yield*/, client.send("create_series", [
                                    this.chartSession,
                                    s_id,
                                    "s1",
                                    symbol_id,
                                    interval,
                                    300,
                                    "",
                                ])];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, s_id];
                    }
                });
            });
        };
        this.fastQuote = function (symbol) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.send("quote_fast_symbols", [this.quoteSession, symbol])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.createStudy = function (series_id, data, study_id) { return __awaiter(_this, void 0, void 0, function () {
            var s_id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s_id = study_id || (0, uuid_1.v4)();
                        return [4 /*yield*/, client.send("create_study", [
                                this.chartSession,
                                s_id,
                                "st1",
                                series_id,
                                "Script@tv-scripting-101!",
                                data,
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, study_id];
                }
            });
        }); };
        this.addIndicator = function (symbol_id, indicator) { return __awaiter(_this, void 0, void 0, function () {
            var res, fields, data;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, tradingview_1.default.translateIndicator(indicator)];
                    case 1:
                        res = _e.sent();
                        fields = (_d = (_c = Object.values((_b = (_a = res === null || res === void 0 ? void 0 : res.result) === null || _a === void 0 ? void 0 : _a.metaInfo) === null || _b === void 0 ? void 0 : _b.styles)) === null || _c === void 0 ? void 0 : _c.map) === null || _d === void 0 ? void 0 : _d.call(_c, function (v) { return v === null || v === void 0 ? void 0 : v.title; });
                        data = __assign({ text: res.result.metaInfo.defaults.inputs.text, pineId: indicator.scriptIdPart, pineVersion: "".concat(indicator.version, ".0"), pineFeatures: {
                                t: "text",
                                f: true,
                                v: res.result.metaInfo.defaults.inputs.pineFeatures,
                            } }, (0, utils_1.getPineInputs)(res.result.metaInfo.defaults.inputs));
                        this.createStudy(symbol_id, data);
                        return [2 /*return*/, fields];
                }
            });
        }); };
        this.chartSession = "cs_".concat((0, utils_1.randomHash)());
        this.quoteSession = "qs_".concat((0, utils_1.randomHash)());
    }
    return TvAPIWorker;
}());
exports.TvAPIWorker = TvAPIWorker;
