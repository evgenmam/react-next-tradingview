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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dexie_1 = __importDefault(require("dexie"));
var DB_VERSION = 3.1;
var DB = /** @class */ (function (_super) {
    __extends(DB, _super);
    function DB() {
        var _this = _super.call(this, "bg-db") || this;
        _this.version(DB_VERSION).stores({
            rows: "id++, dataset, period",
            fields: "id++, dataset",
            indicators: "name",
            settings: "key",
            signals: "id++",
            strategies: "id++",
            lists: "id++",
            charts: "name",
            presets: "id++",
            series: "dataset",
            studies: "id",
            savedScripts: "scriptIdPart",
            studyConfigs: "id",
        });
        return _this;
    }
    return DB;
}(dexie_1.default));
var IDB = new DB();
var migrations = function () { return __awaiter(void 0, void 0, void 0, function () {
    var charts, aapl, spy, presets;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, IDB.charts.toArray()];
            case 1:
                charts = _a.sent();
                aapl = {
                    country: "US",
                    currency_code: "USD",
                    description: "Apple Inc.",
                    exchange: "NASDAQ",
                    logoid: "apple",
                    provider_id: "ice",
                    symbol: "AAPL",
                    type: "stock",
                    typespecs: ["common"],
                };
                spy = {
                    symbol: "SPY",
                    description: "SPDR S&P 500 ETF TRUST",
                    type: "fund",
                    exchange: "NYSE Arca",
                    currency_code: "USD",
                    logoid: "spdr-sandp500-etf-tr",
                    provider_id: "ice",
                    country: "US",
                    typespecs: ["etf"],
                    prefix: "AMEX",
                };
                if (!(charts.length === 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, IDB.lists.bulkAdd([
                        {
                            name: "Watchlist 1",
                            symbols: [aapl],
                        },
                        {
                            name: "Watchlist 2",
                            symbols: [spy],
                        },
                    ])];
            case 2:
                _a.sent();
                return [4 /*yield*/, IDB.charts.bulkAdd([
                        {
                            name: "Numerator",
                            list: 1,
                            symbol: aapl,
                        },
                        {
                            name: "Denominator",
                            list: 2,
                            symbol: spy,
                        },
                    ])];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, IDB.presets.toArray()];
            case 5:
                presets = _a.sent();
                if (!(presets.length === 0)) return [3 /*break*/, 8];
                return [4 /*yield*/, IDB.presets.add({
                        name: "Preset 1",
                        indicators: [
                            {
                                imageUrl: "S8svsT4N",
                                scriptName: "LuxAlgo Oscillators (Premium)",
                                scriptSource: "",
                                access: 3,
                                scriptIdPart: "PUB;8bBrCmCGspE390DLRNWYlXrtDxRIoZYe",
                                version: "12",
                                extra: {
                                    kind: "study",
                                    sourceInputsCount: 0,
                                },
                                agreeCount: 2492,
                                author: {
                                    id: 599151,
                                    username: "LuxAlgo",
                                    is_broker: false,
                                },
                                weight: 6639,
                            },
                            {
                                imageUrl: "fYHlrAoz",
                                scriptName: "LuxAlgo Signals & Overlays (Premium)",
                                scriptSource: "",
                                access: 3,
                                scriptIdPart: "PUB;7pIlmOh7nrutyvfmHTPJQEHlK26okwvl",
                                version: "57",
                                extra: {
                                    kind: "study",
                                    sourceInputsCount: 1,
                                },
                                agreeCount: 16137,
                                author: {
                                    id: 763650,
                                    username: "LuxAlgo",
                                    is_broker: false,
                                },
                            },
                            {
                                imageUrl: "LFBaHNuA",
                                scriptName: "Pivot Points Algo",
                                scriptSource: "",
                                access: 3,
                                scriptIdPart: "PUB;kGJGLu77vLikIl1P4H1OuIWM7m7OA271",
                                version: "36",
                                extra: {
                                    kind: "study",
                                    sourceInputsCount: 1,
                                },
                                agreeCount: 367,
                                author: {
                                    id: 833418,
                                    username: "dman103",
                                    is_broker: false,
                                },
                                weight: 43502,
                            },
                            {
                                imageUrl: "6VH4kH8l",
                                scriptName: "TAS Boxes + TAS Vega + TAS Compass [TASMarketProfile]",
                                scriptSource: "",
                                access: 3,
                                scriptIdPart: "PUB;d2ac68ba96c2432182159828c9928764",
                                version: "1",
                                extra: {
                                    kind: "study",
                                    sourceInputsCount: 0,
                                },
                                agreeCount: 33,
                                author: {
                                    id: 668758,
                                    username: "TASMarketProfile",
                                    is_broker: false,
                                },
                                weight: 24814,
                            },
                        ],
                        selected: true,
                    })];
            case 6:
                _a.sent();
                return [4 /*yield*/, IDB.studyConfigs.bulkAdd([
                        {
                            id: "PUB;7pIlmOh7nrutyvfmHTPJQEHlK26okwvl",
                            collapsed: true,
                            showFields: [
                                "plot_46",
                                "plot_44",
                                "plot_47",
                                "plot_48",
                                "plot_49",
                                "plot_45",
                                "plot_61",
                            ],
                        },
                        {
                            id: "PUB;8bBrCmCGspE390DLRNWYlXrtDxRIoZYe",
                            collapsed: true,
                            showFields: [
                                "plot_0",
                                "plot_1",
                                "plot_28",
                                "plot_25",
                                "plot_26",
                                "plot_24",
                            ],
                        },
                        {
                            id: "PUB;d2ac68ba96c2432182159828c9928764",
                            collapsed: true,
                            showFields: ["plot_0", "plot_2", "plot_1"],
                        },
                        {
                            id: "PUB;kGJGLu77vLikIl1P4H1OuIWM7m7OA271",
                            collapsed: true,
                            showFields: ["plot_24", "plot_25", "plot_28", "plot_29"],
                        },
                    ])];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
migrations();
exports.default = IDB;
IDB.signals.schema;
