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
exports.TVClientC = void 0;
var events_1 = __importDefault(require("events"));
var pino_1 = __importDefault(require("pino"));
var ws_1 = __importDefault(require("ws"));
var tradingview_1 = __importDefault(require("../tradingview"));
var utils_1 = require("../utils");
var URL = "wss://prodata.tradingview.com/socket.io/websocket";
var BUILD_ID = "2023_01_26-12_41";
var CHART_ID = "lfNsKpYG";
var R = __importStar(require("ramda"));
var handlers = {
    quote_add_symbols: function (data) { },
};
var TVClientC = /** @class */ (function () {
    function TVClientC() {
        var _this = this;
        this.handlers = {};
        this.loggedIn = false;
        this.login = function () { return __awaiter(_this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tradingview_1.default.login()];
                    case 1:
                        results = _a.sent();
                        // const chartprops = JSON.parse(results?.user?.settings?.chartproperties);
                        return [4 /*yield*/, this.init(results.user.auth_token)];
                    case 2:
                        // const chartprops = JSON.parse(results?.user?.settings?.chartproperties);
                        _a.sent();
                        this.loggedIn = true;
                        return [2 /*return*/];
                }
            });
        }); };
        this.listen = function (msg, cb) {
            _this.handlers[msg] = cb;
        };
        this.clearListeners = function (prefix) {
            _this.listener.eventNames().forEach(function (v) {
                if (v.toString().startsWith(prefix))
                    _this.listener.removeAllListeners(v);
            });
        };
        this.handle = function () {
            _this.ws.on("message", _this.receive);
            _this.ws.on("error", function (_, error) {
                (0, pino_1.default)({ name: "TVClientC" }).error({ error: error, msg: "WS_ERROR" });
            });
            _this.ws.on("close", function (_, code, reason) {
                (0, pino_1.default)({ name: "TVClientC" }).error({ code: code, reason: reason, msg: "WS_CLOSE" });
            });
        };
        this.sessionEvent = function (e) {
            (0, pino_1.default)({ name: "SESSION_EVENT" }).warn({ msg: e.m });
            var _a = e.p, ses = _a[0], body = _a.slice(1);
            if (e.m.includes("_error")) {
                var ms = { msg: e.m, body: body };
                (0, pino_1.default)({ name: "SESSION_ERROR" }).error(ms);
                _this.listener.emit("".concat(ses, ":error"), ms);
                return;
            }
            switch (e.m) {
                case "symbol_resolved":
                    var sym = body[0], r = body[1], t = body[2], t_ms = body[3];
                    _this.listener.emit("".concat(ses, ":").concat(sym, ":").concat(e.m), r);
                case "timescale_update":
                    var b = body[0];
                    Object.entries(b).forEach(function (_a) {
                        var sym = _a[0], v = _a[1];
                        _this.listener.emit("".concat(ses, ":").concat(sym, ":").concat(e.m), (0, utils_1.timescaleToOHLC)(v));
                    });
                case "du":
                    var d = body[0];
                    Object.entries(d).forEach(function (_a) {
                        var sym = _a[0], v = _a[1];
                        if (R.has("st", v))
                            _this.listener.emit("".concat(ses, ":").concat(sym, ":").concat(e.m), (0, utils_1.duFixTimestamp)(v));
                    });
                default:
                    _this.listener.emit("".concat(ses, ":").concat(e.m), e.p);
            }
        };
        this.receive = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var message, messages;
            var _this = this;
            return __generator(this, function (_a) {
                message = data.toString();
                if ((0, utils_1.isPing)(message)) {
                    return [2 /*return*/, this.ws.send(message)];
                }
                else if (message.startsWith("~m~")) {
                    messages = (0, utils_1.readMessages)(message);
                    messages.forEach(function (v) {
                        var _a, _b, _c, _d, _e;
                        if (typeof v === "object" && v.m) {
                            (_b = (_a = _this.handlers)[v.m]) === null || _b === void 0 ? void 0 : _b.call(_a, v.p);
                            if ((_e = (_d = (_c = v === null || v === void 0 ? void 0 : v.p) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.startsWith) === null || _e === void 0 ? void 0 : _e.call(_d, "cs_")) {
                                _this.sessionEvent(v);
                            }
                        }
                    });
                }
                return [2 /*return*/];
            });
        }); };
        this.waitFor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new Promise(function (resolve) {
                var cb = function (v) {
                    _this.listener.removeListener(args.join(":"), cb);
                    resolve(v);
                };
                _this.listener.once(args.join(":"), cb);
            });
        };
        this.onError = function (prefix) {
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var cb;
                var _this = this;
                return __generator(this, function (_a) {
                    cb = function (v) {
                        _this.listener.removeListener("".concat(prefix, ":error"), cb);
                        resolve(v);
                    };
                    this.listener.once("".concat(prefix, ":error"), cb);
                    return [2 /*return*/, function () { return _this.listener.removeListener("".concat(prefix, ":error"), cb); }];
                });
            }); });
        };
        this.send = function (m, data) { return __awaiter(_this, void 0, void 0, function () {
            var ms, message, encoded;
            return __generator(this, function (_a) {
                ms = { m: m, p: data };
                message = JSON.stringify(ms);
                encoded = "~m~".concat(message.length, "~m~").concat(message);
                (0, pino_1.default)({ name: "TVClient" }).info({ sending: m });
                this.ws.send(encoded);
                return [2 /*return*/];
            });
        }); };
        this.init = function (user_token) {
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.ws.readyState === ws_1.default.OPEN) {
                        this.send("set_auth_token", [user_token]);
                        resolve();
                    }
                    return [2 /*return*/];
                });
            }); });
        };
        this.disconnect = function () {
            return new Promise(function (resolve) {
                _this.ws.on("close", function () {
                    resolve();
                });
                _this.ws.close();
            });
        };
        this.reconnect = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.listener.removeAllListeners();
                        this.ws.terminate();
                        this.ws = new ws_1.default("".concat(URL, "?from=chart%2F").concat(CHART_ID, "%2F&date=").concat(BUILD_ID, "&type=chart"), { headers: { Origin: "https://www.tradingview.com" } });
                        this.handle();
                        return [4 /*yield*/, this.login()];
                    case 1:
                        _a.sent();
                        this.listener = new events_1.default();
                        return [2 /*return*/];
                }
            });
        }); };
        this.ws = new ws_1.default("".concat(URL, "?from=chart%2F").concat(CHART_ID, "%2F&date=").concat(BUILD_ID, "&type=chart"), { headers: { Origin: "https://www.tradingview.com" } });
        this.handle();
        this.listener = new events_1.default();
    }
    return TVClientC;
}());
exports.TVClientC = TVClientC;
var TVClient = TVClientC;
exports.default = TVClient;
