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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var tv_market_data_1 = require("../helpers/tv-market-data");
var tradingview_1 = __importDefault(require("../tradingview"));
var utils_1 = require("../utils");
var indicators_1 = __importDefault(require("./indicators"));
var scripts_1 = __importDefault(require("./scripts"));
var router = (0, express_1.Router)();
router.use("/indicators", indicators_1.default);
router.use("/scripts", scripts_1.default);
router.get("/", function (req, res) {
    res.send("pong");
});
router.get("/search", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, text, exchange, type, results;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, text = _a.text, exchange = _a.exchange, type = _a.type;
                return [4 /*yield*/, tradingview_1.default.search({ text: text, exchange: exchange, type: type })];
            case 1:
                results = _b.sent();
                res.send(results);
                return [2 /*return*/];
        }
    });
}); });
var getSymbol = function (res, _a) {
    var symbol = _a.symbol, _b = _a.period, period = _b === void 0 ? "1W" : _b, _c = _a.count, count = _c === void 0 ? 300 : _c, _d = _a.indicators, indicators = _d === void 0 ? [] : _d, _e = _a.chartType, chartType = _e === void 0 ? "candlestick" : _e;
    return __awaiter(void 0, void 0, void 0, function () {
        var nSession, data, studies, _i, indicators_2, indicator, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    nSession = new tv_market_data_1.TVChartSession(res);
                    return [4 /*yield*/, nSession.init()];
                case 1:
                    _h.sent();
                    return [4 /*yield*/, nSession.getSymbol(symbol, period, +count, chartType)];
                case 2:
                    data = _h.sent();
                    studies = [];
                    _i = 0, indicators_2 = indicators;
                    _h.label = 3;
                case 3:
                    if (!(_i < indicators_2.length)) return [3 /*break*/, 6];
                    indicator = indicators_2[_i];
                    // const d: any[] = await nSession.getIndicator(symbol, indicator);
                    // data = (data as any[]).map((v, i) => ({ ...v, ...d[i] }));
                    _g = (_f = studies).push;
                    return [4 /*yield*/, nSession.getIndicator(symbol, indicator)];
                case 4:
                    // const d: any[] = await nSession.getIndicator(symbol, indicator);
                    // data = (data as any[]).map((v, i) => ({ ...v, ...d[i] }));
                    _g.apply(_f, [_h.sent()]);
                    _h.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    nSession.cleanup();
                    //@ts-ignore
                    return [2 /*return*/, [(0, utils_1.mergeDataAndStudies)(data, studies), studies]];
            }
        });
    });
};
router.post("/market-data", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var s, _a, n, d, i, b, _b, numerator, denominator, _c, split, studies;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!(req.body.numerator && req.body.denominator)) return [3 /*break*/, 2];
                s = "".concat(req.body.numerator, "/").concat(req.body.denominator);
                _a = req.body, n = _a.numerator, d = _a.denominator, i = _a.indicators, b = __rest(_a, ["numerator", "denominator", "indicators"]);
                return [4 /*yield*/, Promise.all([
                        getSymbol(res, __assign({ symbol: n }, b)),
                        getSymbol(res, __assign({ symbol: d }, b)),
                        getSymbol(res, __assign(__assign({ symbol: s }, b), { indicators: i })),
                    ])];
            case 1:
                _b = _d.sent(), numerator = _b[0][0], denominator = _b[1][0], _c = _b[2], split = _c[0], studies = _c[1];
                if (!res.headersSent)
                    return [2 /*return*/, res.send({ numerator: numerator, denominator: denominator, split: split, studies: studies })];
                _d.label = 2;
            case 2:
                if (!res.headersSent)
                    res.send({});
                return [2 /*return*/];
        }
    });
}); });
router.get("/reconnect", function (req, res) {
    (0, tv_market_data_1.reconnect)();
    res.send("ok");
});
router.get("/status", function (req, res) {
    res.send({ status: (0, tv_market_data_1.status)() });
});
router.post("/bulk-market-data", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nSession, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                nSession = new tv_market_data_1.TVChartSession(res);
                return [4 /*yield*/, nSession.init()];
            case 1:
                _a.sent();
                return [4 /*yield*/, nSession.getBulkData(req.body)];
            case 2:
                data = _a.sent();
                res.send(data);
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
