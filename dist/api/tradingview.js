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
var axios_1 = __importDefault(require("axios"));
var form_data_1 = __importDefault(require("form-data"));
var fs_1 = __importDefault(require("fs"));
var TVApiC = /** @class */ (function () {
    function TVApiC() {
        var _this = this;
        this.l = function () { return __awaiter(_this, void 0, void 0, function () {
            var headers, body, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = new Headers();
                        headers.append("Referer", "https://www.tradingview.com/");
                        body = new URLSearchParams();
                        body.append("username", process.env.TV_EMAIL);
                        body.append("password", process.env.TV_PASSWORD);
                        body.append("remember", "on");
                        return [4 /*yield*/, fetch("https://www.tradingview.com/accounts/signin/", {
                                method: "post",
                                headers: headers,
                                body: body,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        }); };
        this.login = function () { return __awaiter(_this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                r = JSON.parse(fs_1.default.readFileSync("response.json", "utf-8"));
                return [2 /*return*/, r];
            });
        }); };
        this.getAuthToken = function () { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.login()];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.auth_token];
                }
            });
        }); };
        this.getAuthCookie = function () { return __awaiter(_this, void 0, void 0, function () {
            var res, h;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.l()];
                    case 1:
                        res = _d.sent();
                        h = res.headers.get("set-cookie");
                        if (h) {
                            return [2 /*return*/, (_c = (_b = (_a = h === null || h === void 0 ? void 0 : h.split("; ")) === null || _a === void 0 ? void 0 : _a.filter(function (c) { return c.startsWith("Secure, "); })) === null || _b === void 0 ? void 0 : _b.map(function (v) { return v.replace("Secure, ", ""); })) === null || _c === void 0 ? void 0 : _c.join("; ")];
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.search = function (query) { return __awaiter(_this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("https://symbol-search.tradingview.com/s/", {
                                params: __assign(__assign({}, query), { lang: "en", domain: "production" }),
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.searchIndicators = function (search) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://www.tradingview.com/pubscripts-suggest-json", { params: { search: search } })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                }
            });
        }); };
        this.translateIndicator = function (indicator) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://pine-facade.tradingview.com/pine-facade/translate/" +
                            indicator.scriptIdPart +
                            "/" +
                            indicator.version, {
                            headers: {
                                referer: "https://www.tradingview.com/",
                            },
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                }
            });
        }); };
        this.getPrivateScripts = function () { return __awaiter(_this, void 0, void 0, function () {
            var cookie, cfg, scripts, fd, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAuthCookie()];
                    case 1:
                        cookie = _a.sent();
                        cfg = { headers: { cookie: cookie, origin: "https://www.tradingview.com" } };
                        return [4 /*yield*/, axios_1.default.post("https://www.tradingview.com/pine_perm/list_scripts/", {}, cfg)];
                    case 2:
                        scripts = (_a.sent()).data;
                        fd = new form_data_1.default();
                        fd.append("scriptIdPart", scripts.join(","));
                        return [4 /*yield*/, axios_1.default.post("https://www.tradingview.com/pubscripts-get/", fd, cfg)];
                    case 3:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                }
            });
        }); };
        this.postStrategy = function (script, name, toDelete) { return __awaiter(_this, void 0, void 0, function () {
            var cookie, cfg, body, _a, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getAuthCookie()];
                    case 1:
                        cookie = _b.sent();
                        cfg = { headers: { cookie: cookie, origin: "https://www.tradingview.com" } };
                        body = new form_data_1.default();
                        if (!toDelete) return [3 /*break*/, 5];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.post(" https://pine-facade.tradingview.com/pine-facade/delete/".concat(toDelete), cfg)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        body.append("source", script);
                        return [4 /*yield*/, axios_1.default.post("https://pine-facade.tradingview.com/pine-facade/save/new/?name=".concat(name), body, __assign(__assign({}, cfg), { params: { name: name, allow_overwrite: true } }))];
                    case 6:
                        data = (_b.sent()).data;
                        return [2 /*return*/, data];
                }
            });
        }); };
    }
    return TVApiC;
}());
var TVApi = new TVApiC();
exports.default = TVApi;
