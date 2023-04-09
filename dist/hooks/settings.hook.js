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
exports.useSettings = exports.useSetting = void 0;
var dexie_react_hooks_1 = require("dexie-react-hooks");
var R = __importStar(require("ramda"));
var db_1 = __importDefault(require("../db/db"));
var useSetting = function (k, defaultValue) {
    var value = (0, dexie_react_hooks_1.useLiveQuery)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var value;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db_1.default.settings.get(k)];
                case 1:
                    value = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.value;
                    if (R.isNil(value)) {
                        db_1.default.settings.put({ key: k, value: defaultValue });
                        return [2 /*return*/, defaultValue];
                    }
                    return [2 /*return*/, value || null];
            }
        });
    }); });
    var setter = function (v) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.settings.put({ key: k, value: v })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return [value, setter];
};
exports.useSetting = useSetting;
var useSettings = function () {
    var _a = (0, exports.useSetting)("hideEmpty", true), hideEmpty = _a[0], setHideEmpty = _a[1];
    var _b = (0, exports.useSetting)("maxDigits", 4), maxDigits = _b[0], setMaxDigits = _b[1];
    var _c = (0, exports.useSetting)("source", ""), source = _c[0], setSource = _c[1];
    var _d = (0, exports.useSetting)("target", ""), target = _d[0], setTarget = _d[1];
    var _e = (0, exports.useSetting)("target2", ""), target2 = _e[0], setTarget2 = _e[1];
    var _f = (0, exports.useSetting)("fetching", false), fetching = _f[0], setFetching = _f[1];
    var _g = (0, exports.useSetting)("signals", true), showSignals = _g[0], setShowSignals = _g[1];
    var _h = (0, exports.useSetting)("strategies", true), showStrategies = _h[0], setShowStrategies = _h[1];
    var _j = (0, exports.useSetting)("period", "1W"), period = _j[0], setPeriod = _j[1];
    var _k = (0, exports.useSetting)("chartType", "candlestick"), chartType = _k[0], setChartType = _k[1];
    var _l = (0, exports.useSetting)("barCount", 300), count = _l[0], setCount = _l[1];
    var _m = (0, exports.useSetting)("theme", "dark"), theme = _m[0], setTheme = _m[1];
    var _o = (0, exports.useSetting)("legends", true), legends = _o[0], setLegends = _o[1];
    var _p = (0, exports.useSetting)("syncLine", true), syncLine = _p[0], setSyncLine = _p[1];
    var _q = (0, exports.useSetting)("syncRange", true), syncRange = _q[0], setSyncRange = _q[1];
    var _r = (0, exports.useSetting)("takeProfit", 0), takeProfit = _r[0], setTakeProfit = _r[1];
    var _s = (0, exports.useSetting)("stopLoss", 0), stopLoss = _s[0], setStopLoss = _s[1];
    var _t = (0, exports.useSetting)("syncRange", true), reverseStrategies = _t[0], setReverseStrategies = _t[1];
    var sett = function (k) { return function (v) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.settings.put({ key: k, value: v })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }; };
    return {
        hideEmpty: hideEmpty,
        setHideEmpty: setHideEmpty,
        maxDigits: maxDigits,
        setMaxDigits: setMaxDigits,
        source: source,
        setSource: setSource,
        target: target,
        setTarget: setTarget,
        sett: sett,
        showSignals: showSignals,
        setShowSignals: setShowSignals,
        showStrategies: showStrategies,
        setShowStrategies: setShowStrategies,
        theme: theme,
        setTheme: setTheme,
        target2: target2,
        setTarget2: setTarget2,
        fetching: fetching,
        setFetching: setFetching,
        period: period,
        setPeriod: setPeriod,
        chartType: chartType,
        setChartType: setChartType,
        legends: legends,
        setLegends: setLegends,
        count: count,
        setCount: setCount,
        syncLine: syncLine,
        setSyncLine: setSyncLine,
        syncRange: syncRange,
        setSyncRange: setSyncRange,
        reverseStrategies: reverseStrategies,
        setReverseStrategies: setReverseStrategies,
        takeProfit: takeProfit,
        setTakeProfit: setTakeProfit,
        stopLoss: stopLoss,
        setStopLoss: setStopLoss,
    };
};
exports.useSettings = useSettings;
