"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = exports.reconnect = exports.TVQuoteSession = exports.TVChartSession = exports.TVMarketData = void 0;
var pino_1 = __importDefault(require("pino"));
var uuid_1 = require("uuid");
var tv_client_1 = __importDefault(require("../helpers/tv-client"));
var tradingview_1 = __importDefault(require("../tradingview"));
var utils_1 = require("../utils");
var tvc = new tv_client_1.default();
var TVMarketData = /** @class */ (function () {
    function TVMarketData() {
        this.chartSession = "cs_".concat((0, utils_1.randomHash)());
        this.quoteSession = "qs_".concat((0, utils_1.randomHash)());
    }
    return TVMarketData;
}());
exports.TVMarketData = TVMarketData;
var TVSession = /** @class */ (function () {
    function TVSession() {
    }
    TVSession.prototype.hc = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (tvc.ws.readyState !== tvc.ws.OPEN) {
                    tvc.ws.on("open", function () {
                        resolve();
                    });
                }
                else {
                    resolve();
                }
                return [2 /*return*/];
            });
        }); });
    };
    return TVSession;
}());
var wait = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var TVChartSession = /** @class */ (function (_super) {
    __extends(TVChartSession, _super);
    function TVChartSession(res) {
        var _this = _super.call(this) || this;
        _this.init = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!tvc.loggedIn) return [3 /*break*/, 2];
                        return [4 /*yield*/, tvc.login()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.hc()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, tvc.send("chart_create_session", [this.session])];
                    case 4:
                        _a.sent();
                        tvc.onError(this.session).then(function (v) {
                            var _a, _b, _c;
                            _this.cleanup();
                            (_c = (_b = (_a = _this.res) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.call(_a, 410)) === null || _c === void 0 ? void 0 : _c.send(v);
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        _this.cleanup = function (symbol) {
            if (symbol)
                tvc.send("remove_series", [_this.session, symbol]);
            tvc.clearListeners(_this.session);
        };
        _this.waitFor = function () {
            var msg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                msg[_i] = arguments[_i];
            }
            return tvc.waitFor.apply(tvc, __spreadArray([_this.session], msg, false));
        };
        _this.waitForMax = function (ms, fallback) {
            if (fallback === void 0) { fallback = []; }
            var msg = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                msg[_i - 2] = arguments[_i];
            }
            return new Promise(function (resolve) {
                tvc.waitFor.apply(tvc, __spreadArray([_this.session], msg, false)).then(resolve);
                setTimeout(function () { return resolve(fallback); }, ms);
            });
        };
        _this.subscribe = function (cb) {
            var msg = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                msg[_i - 1] = arguments[_i];
            }
            return tvc.subscribe.apply(tvc, __spreadArray([cb, _this.session], msg, false));
        };
        _this.ssend = function (msg) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return tvc.send(msg, __spreadArray([_this.session], args, true));
        };
        _this.getSymbol = function (symbol, interval, count, chartType) {
            if (interval === void 0) { interval = "1W"; }
            if (count === void 0) { count = 300; }
            if (chartType === void 0) { chartType = "candlestick"; }
            return __awaiter(_this, void 0, void 0, function () {
                var symbol_id, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            symbol_id = symbol.replace(":", "::");
                            tvc.send("resolve_symbol", [
                                this.session,
                                symbol_id,
                                (0, utils_1.wrapSymbol)(symbol, chartType),
                            ]);
                            return [4 /*yield*/, this.waitFor(symbol_id, "symbol_resolved")];
                        case 1:
                            _a.sent();
                            tvc.send("create_series", [
                                this.session,
                                symbol,
                                symbol,
                                symbol_id,
                                interval,
                                count,
                                "",
                            ]);
                            data = this.waitFor(symbol, "timescale_update");
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        _this.getIndicator = function (symbol, ind) { return __awaiter(_this, void 0, void 0, function () {
            var res, fields, sd, data, values;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, tradingview_1.default.translateIndicator(ind)];
                    case 1:
                        res = _g.sent();
                        fields = (_d = (_c = Object.values((_b = (_a = res === null || res === void 0 ? void 0 : res.result) === null || _a === void 0 ? void 0 : _a.metaInfo) === null || _b === void 0 ? void 0 : _b.styles)) === null || _c === void 0 ? void 0 : _c.map) === null || _d === void 0 ? void 0 : _d.call(_c, function (v) { return v === null || v === void 0 ? void 0 : v.title; });
                        sd = (_f = (_e = res === null || res === void 0 ? void 0 : res.result) === null || _e === void 0 ? void 0 : _e.metaInfo) === null || _f === void 0 ? void 0 : _f.shortDescription;
                        data = (0, utils_1.getPineInputs)(res.result.metaInfo, ind);
                        return [4 /*yield*/, tvc.send("create_study", [
                                this.session,
                                ind.scriptName,
                                ind.scriptName,
                                symbol,
                                "Script@tv-scripting-101!",
                                data,
                            ])];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, this.waitFor(ind.scriptName, "du")];
                    case 3:
                        values = _g.sent();
                        return [4 /*yield*/, tvc.send("remove_study", [this.session, ind.scriptName])];
                    case 4:
                        _g.sent();
                        return [2 /*return*/, {
                                data: values,
                                meta: res.result.metaInfo,
                                id: values === null || values === void 0 ? void 0 : values.t,
                            }];
                }
            });
        }); };
        _this.getBulkData = function (_a) {
            var _b = _a.nums, nums = _b === void 0 ? [] : _b, _c = _a.dens, dens = _c === void 0 ? [] : _c, _d = _a.indicators, indicators = _d === void 0 ? [] : _d, _e = _a.period, period = _e === void 0 ? "1W" : _e, _f = _a.count, count = _f === void 0 ? 300 : _f, _g = _a.chartType, chartType = _g === void 0 ? "candlestick" : _g;
            return __awaiter(_this, void 0, void 0, function () {
                var series_id, rows, uns, _i, _h, s, symbol_id, studies, studyMeta, _j, indicators_1, i, res, data, _k, nums_1, s, _l, dens_1, d, symbol, symbol_id, _m, _o, _p;
                var _this = this;
                return __generator(this, function (_q) {
                    switch (_q.label) {
                        case 0:
                            rows = [];
                            uns = [];
                            _i = 0, _h = __spreadArray(__spreadArray([], nums, true), dens, true);
                            _q.label = 1;
                        case 1:
                            if (!(_i < _h.length)) return [3 /*break*/, 5];
                            s = _h[_i];
                            symbol_id = s.replace(":", "::");
                            this.ssend("resolve_symbol", symbol_id, (0, utils_1.wrapSymbol)(s, chartType));
                            return [4 /*yield*/, this.waitFor(symbol_id, "symbol_resolved")];
                        case 2:
                            _q.sent();
                            if (!series_id) {
                                series_id = (0, uuid_1.v4)();
                                this.ssend("create_series", series_id, s, symbol_id, period, +count, "");
                                uns.push(this.subscribe(function (d) { return rows.push.apply(rows, d); }, series_id, "timescale_update"));
                            }
                            else {
                                this.ssend("modify_series", series_id, s, symbol_id, period, "");
                            }
                            return [4 /*yield*/, this.waitFor(series_id, "series_completed")];
                        case 3:
                            _q.sent();
                            _q.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5:
                            studies = [];
                            studyMeta = {};
                            _j = 0, indicators_1 = indicators;
                            _q.label = 6;
                        case 6:
                            if (!(_j < indicators_1.length)) return [3 /*break*/, 10];
                            i = indicators_1[_j];
                            return [4 /*yield*/, tradingview_1.default.translateIndicator(i)];
                        case 7:
                            res = _q.sent();
                            data = (0, utils_1.getPineInputs)(res.result.metaInfo, i);
                            studyMeta[i.scriptName] = res.result.metaInfo;
                            return [4 /*yield*/, tvc.send("create_study", [
                                    this.session,
                                    i.scriptName,
                                    i.scriptName,
                                    series_id,
                                    "Script@tv-scripting-101!",
                                    data,
                                ])];
                        case 8:
                            _q.sent();
                            _q.label = 9;
                        case 9:
                            _j++;
                            return [3 /*break*/, 6];
                        case 10:
                            if (!series_id) return [3 /*break*/, 17];
                            _k = 0, nums_1 = nums;
                            _q.label = 11;
                        case 11:
                            if (!(_k < nums_1.length)) return [3 /*break*/, 17];
                            s = nums_1[_k];
                            _l = 0, dens_1 = dens;
                            _q.label = 12;
                        case 12:
                            if (!(_l < dens_1.length)) return [3 /*break*/, 16];
                            d = dens_1[_l];
                            symbol = "".concat(s, "/").concat(d);
                            symbol_id = symbol.replace(":", "::");
                            this.ssend("resolve_symbol", symbol_id, (0, utils_1.wrapSymbol)(symbol, chartType));
                            return [4 /*yield*/, this.waitFor(symbol_id, "symbol_resolved")];
                        case 13:
                            _q.sent();
                            this.ssend("modify_series", series_id, symbol, symbol_id, period, "");
                            _o = (_m = studies.push).apply;
                            _p = [studies];
                            return [4 /*yield*/, Promise.all(indicators.map(function (i) {
                                    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                        var du;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.waitFor(i.scriptName, "du")];
                                                case 1:
                                                    du = _a.sent();
                                                    //@ts-ignore
                                                    resolve({
                                                        data: du,
                                                        meta: studyMeta[i.scriptName],
                                                        id: du === null || du === void 0 ? void 0 : du.t,
                                                    });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                }))];
                        case 14:
                            _o.apply(_m, _p.concat([(_q.sent())]));
                            _q.label = 15;
                        case 15:
                            _l++;
                            return [3 /*break*/, 12];
                        case 16:
                            _k++;
                            return [3 /*break*/, 11];
                        case 17: return [4 /*yield*/, wait(3000)];
                        case 18:
                            _q.sent();
                            uns === null || uns === void 0 ? void 0 : uns.forEach(function (u) { return u === null || u === void 0 ? void 0 : u(); });
                            return [2 /*return*/, {
                                    data: (0, utils_1.mergeMixedDataAndStudies)(rows, studies),
                                    datasets: (0, utils_1.getUniqueDatasets)(rows),
                                    studies: studies,
                                }];
                    }
                });
            });
        };
        _this.res = res;
        _this.session = "cs_".concat((0, utils_1.randomHash)());
        (0, pino_1.default)({ name: "TVChartSession" }).info({ session: _this.session });
        return _this;
    }
    return TVChartSession;
}(TVSession));
exports.TVChartSession = TVChartSession;
var TVQuoteSession = /** @class */ (function (_super) {
    __extends(TVQuoteSession, _super);
    function TVQuoteSession() {
        var _this = _super.call(this) || this;
        _this.init = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hc()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tvc.send("quote_create_session", [this.session])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.addSymbol = function (symbol) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tvc.send("quote_add_symbols", [this.session, symbol])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.session = "qs_".concat((0, utils_1.randomHash)());
        return _this;
    }
    return TVQuoteSession;
}(TVSession));
exports.TVQuoteSession = TVQuoteSession;
var reconnect = function () {
    tvc.reconnect();
};
exports.reconnect = reconnect;
var status = function () {
    return tvc.ws.readyState;
};
exports.status = status;
