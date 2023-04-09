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
exports.useSettings = exports.useSetting = exports.useLists = exports.useActiveList = exports.useStrategies = exports.useSignals = exports.useFields = exports.useDatasets = exports.useCompareRows = exports.useRows = exports.useMinMax = exports.useIndicators = void 0;
var dexie_react_hooks_1 = require("dexie-react-hooks");
var R = __importStar(require("ramda"));
var db_1 = __importDefault(require("../db/db"));
var react_1 = require("react");
var settings_hook_1 = require("./settings.hook");
var useIndicators = function () {
    var indicators = (0, dexie_react_hooks_1.useLiveQuery)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.indicators.toArray()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }) || [];
    var addIndicator = function (indicator) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.indicators.get(indicator.name)];
                case 1:
                    if (_a.sent())
                        return [2 /*return*/];
                    return [4 /*yield*/, db_1.default.indicators.add(indicator)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var removeIndicator = function (name) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.indicators.delete(name)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var updateIndicator = function (indicator) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.indicators.update(indicator.name, indicator)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return { indicators: indicators, addIndicator: addIndicator, removeIndicator: removeIndicator, updateIndicator: updateIndicator };
};
exports.useIndicators = useIndicators;
var getFirstRow = function (dataset) { return __awaiter(void 0, void 0, void 0, function () {
    var ds;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, db_1.default.settings.get(dataset)];
            case 1:
                ds = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.value;
                if (!ds)
                    return [2 /*return*/, 0];
                return [4 /*yield*/, db_1.default.rows.where("dataset").equals(ds).limit(1).sortBy("time")];
            case 2: return [2 /*return*/, (((_b = (_c.sent())[0]) === null || _b === void 0 ? void 0 : _b.time) || 0)];
        }
    });
}); };
var useMinMax = function () {
    var _a, _b;
    var _c = (0, settings_hook_1.useSettings)(), source = _c.source, target = _c.target, target2 = _c.target2;
    var ds = (0, dexie_react_hooks_1.useLiveQuery)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var s, sorted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.rows
                        .where("dataset")
                        .anyOf([source, target, target2].filter(function (x) { return x; }))
                        .toArray()];
                case 1:
                    s = _a.sent();
                    sorted = R.sortBy(R.prop("time"))(s);
                    return [2 /*return*/, { min: sorted.at(1), max: sorted.at(-1) }];
            }
        });
    }); }, [source, target, target2]);
    return {
        min: (_a = ds === null || ds === void 0 ? void 0 : ds.min) === null || _a === void 0 ? void 0 : _a.time,
        max: (_b = ds === null || ds === void 0 ? void 0 : ds.max) === null || _b === void 0 ? void 0 : _b.time,
    };
};
exports.useMinMax = useMinMax;
var getMinRow = function () { return __awaiter(void 0, void 0, void 0, function () {
    var source, target, target2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getFirstRow("source")];
            case 1:
                source = _a.sent();
                return [4 /*yield*/, getFirstRow("target")];
            case 2:
                target = _a.sent();
                return [4 /*yield*/, getFirstRow("target2")];
            case 3:
                target2 = _a.sent();
                return [2 /*return*/, Math.max(source, target, target2)];
        }
    });
}); };
var useRows = function (datasetName) {
    var _a = (0, react_1.useState)(false), loading = _a[0], setLoading = _a[1];
    var rows = (0, dexie_react_hooks_1.useLiveQuery)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var minRow, dataset, maxDigits, data;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setLoading(true);
                    if (!datasetName)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, getMinRow()];
                case 1:
                    minRow = _c.sent();
                    return [4 /*yield*/, db_1.default.settings.get(datasetName)];
                case 2:
                    dataset = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.value;
                    if (!dataset)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, db_1.default.settings.get("maxDigits")];
                case 3:
                    maxDigits = (_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.value;
                    return [4 /*yield*/, db_1.default.rows
                            .where("dataset")
                            .equals(dataset)
                            .and(function (v) { return v.time >= minRow; })
                            .toArray()];
                case 4:
                    data = (_c.sent()).map(R.pipe(R.dissoc("dataset"), R.mapObjIndexed(function (v, k) { return (k === "time" ? v : +v.toFixed(maxDigits)); })));
                    setLoading(false);
                    return [2 /*return*/, R.pipe(R.uniqBy(R.prop("time")), R.sortBy(R.prop("time")))(data)];
            }
        });
    }); }, [datasetName]) || [];
    var count = (0, dexie_react_hooks_1.useLiveQuery)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var dataset;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!datasetName)
                        return [2 /*return*/, 0];
                    return [4 /*yield*/, db_1.default.settings.get(datasetName)];
                case 1:
                    dataset = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.value;
                    if (!dataset)
                        return [2 /*return*/, 0];
                    return [4 /*yield*/, db_1.default.rows.where("dataset").equals(dataset).count()];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    }); }, [datasetName]);
    var dataset = (0, dexie_react_hooks_1.useLiveQuery)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!datasetName)
                        return [2 /*return*/, ""];
                    return [4 /*yield*/, db_1.default.settings.get(datasetName)];
                case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.value];
            }
        });
    }); }, [datasetName]) || [];
    var indexed = R.indexBy(R.prop("time"))(rows);
    var setRows = function (rows) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db_1.default.rows.where("dataset").equals(dataset).delete();
                    return [4 /*yield*/, db_1.default.rows.bulkAdd(rows)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var clearRows = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.rows.clear()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        rows: rows,
        setRows: setRows,
        clearRows: clearRows,
        indexed: indexed,
        dataset: dataset,
        count: count,
        loading: loading,
    };
};
exports.useRows = useRows;
var useCompareRows = function (num, den) {
    var data = (0, dexie_react_hooks_1.useLiveQuery)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var nums, dens, divs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.rows.where("dataset").equals(num).toArray()];
                case 1:
                    nums = _a.sent();
                    return [4 /*yield*/, db_1.default.rows.where("dataset").equals(den).toArray()];
                case 2:
                    dens = _a.sent();
                    return [4 /*yield*/, db_1.default.rows
                            .where("dataset")
                            .equals("".concat(num, "/").concat(den))
                            .toArray()];
                case 3:
                    divs = _a.sent();
                    return [2 /*return*/, R.map(R.uniqBy(R.prop("time")), [nums, dens, divs])];
            }
        });
    }); }, [num, den]);
    var setRows = function (d) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); };
    return data;
};
exports.useCompareRows = useCompareRows;
var useDatasets = function () {
    var datasets = (0, dexie_react_hooks_1.useLiveQuery)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.rows.orderBy("dataset").uniqueKeys()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }) || [];
    var remove = function (dataset) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.rows.where("dataset").equals(dataset).delete()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return { datasets: datasets, remove: remove };
};
exports.useDatasets = useDatasets;
var useFields = function (datasetName) {
    if (datasetName === void 0) { datasetName = "source"; }
    var fields = (0, dexie_react_hooks_1.useLiveQuery)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var dataset, hideEmpty, rows;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db_1.default.settings.get(datasetName)];
                case 1:
                    dataset = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.value;
                    return [4 /*yield*/, db_1.default.settings.get("hideEmpty")];
                case 2:
                    hideEmpty = (_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.value;
                    if (!dataset)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, db_1.default.rows.where("dataset").equals(dataset).toArray()];
                case 3:
                    rows = (_c.sent()).reduce(R.mergeWith(R.or), {});
                    return [2 /*return*/, R.pipe(R.keys, R.reject(function (v) { return hideEmpty && R.isNil(rows[v]); }))(rows)];
            }
        });
    }); }) || [];
    // const setFields = async (fields: IField[]) => {
    //   await IDB.fields.bulkAdd(fields);
    // };
    // const clearFields = async () => {
    //   await IDB.fields.clear();
    // };
    return { fields: fields };
};
exports.useFields = useFields;
var useSignals = function () {
    var signals = (0, dexie_react_hooks_1.useLiveQuery)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.signals.toArray()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }) || [];
    var addSignal = function (signal) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.signals.add(signal)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var removeSignal = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id) return [3 /*break*/, 2];
                    return [4 /*yield*/, db_1.default.signals.delete(id)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var updateSignal = function (signal) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!signal.id) return [3 /*break*/, 2];
                    return [4 /*yield*/, db_1.default.signals.update(signal.id, signal)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    return { signals: signals, addSignal: addSignal, removeSignal: removeSignal, updateSignal: updateSignal };
};
exports.useSignals = useSignals;
var useStrategies = function () {
    var _a = (0, react_1.useState)(false), loading = _a[0], setLoading = _a[1];
    var _b = (0, settings_hook_1.useSettings)(), reverseStrategies = _b.reverseStrategies, setReverseStrategies = _b.setReverseStrategies;
    var strategies = (0, dexie_react_hooks_1.useLiveQuery)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    return [4 /*yield*/, db_1.default.strategies.toArray()];
                case 1:
                    data = _a.sent();
                    setLoading(false);
                    return [2 /*return*/, data];
            }
        });
    }); }) || [];
    var addStrategy = function (strategy) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.strategies.add(strategy)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var removeStrategy = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id) return [3 /*break*/, 2];
                    return [4 /*yield*/, db_1.default.strategies.delete(id)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var updateStrategy = function (strategy) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!strategy.id) return [3 /*break*/, 2];
                    return [4 /*yield*/, db_1.default.strategies.update(strategy.id, strategy)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    return {
        strategies: strategies,
        addStrategy: addStrategy,
        removeStrategy: removeStrategy,
        updateStrategy: updateStrategy,
        loading: loading,
        reverse: reverseStrategies,
        setReverse: setReverseStrategies,
    };
};
exports.useStrategies = useStrategies;
var useActiveList = function () {
    var list = (0, dexie_react_hooks_1.useLiveQuery)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var l;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ((_a = db_1.default.lists) === null || _a === void 0 ? void 0 : _a.filter(function (v) { return !!v.selected; }).first())];
                case 1:
                    l = _b.sent();
                    return [2 /*return*/, l];
            }
        });
    }); });
    var setActive = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.lists.filter(function (v) { return !!v.selected; }).modify({ selected: false })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.lists.update(id, { selected: true })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var addSymbol = function (symbol) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!list)
                        return [2 /*return*/];
                    return [4 /*yield*/, db_1.default.lists.update(list.id, { symbols: __spreadArray(__spreadArray([], list.symbols, true), [symbol], false) })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var removeSymbol = function (symbol) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!list)
                        return [2 /*return*/];
                    return [4 /*yield*/, db_1.default.lists.update(list.id, {
                            symbols: R.reject(R.equals(symbol), list.symbols),
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return { list: list, setActive: setActive, addSymbol: addSymbol, removeSymbol: removeSymbol };
};
exports.useActiveList = useActiveList;
var useLists = function () {
    var lists = (0, dexie_react_hooks_1.useLiveQuery)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.lists.toArray()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }) || [];
    var createList = function (name) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.lists.add({ name: name, selected: false, symbols: [] })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    var deleteList = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (id === 1)
                        return [2 /*return*/];
                    return [4 /*yield*/, db_1.default.lists.delete(id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.lists.filter(function (v) { return !!v.selected; }).modify({ selected: false })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.lists.update(1, { selected: true })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return { lists: lists, createList: createList, deleteList: deleteList };
};
exports.useLists = useLists;
var settings_hook_2 = require("./settings.hook");
Object.defineProperty(exports, "useSetting", { enumerable: true, get: function () { return settings_hook_2.useSetting; } });
Object.defineProperty(exports, "useSettings", { enumerable: true, get: function () { return settings_hook_2.useSettings; } });
