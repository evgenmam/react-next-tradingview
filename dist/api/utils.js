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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueDatasets = exports.mergeMixedDataAndStudies = exports.mergeDataAndStudies = exports.duFixTimestamp = exports.timescaleToOHLC = exports.getPineInputs = exports.getT = exports.isPing = exports.readMessages = exports.s = exports.wrapSymbol = exports.randomHash = exports.randomHashN = exports.hashh = void 0;
var R = __importStar(require("ramda"));
var color_utils_1 = require("../utils/color.utils");
var n = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var hashh = function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
        var t = (16 * Math.random()) | 0;
        return ("x" === e ? t : (3 & t) | 8).toString(16);
    });
};
exports.hashh = hashh;
var randomHashN = function (e) {
    var t = "";
    for (var o = 0; o < e; ++o) {
        var e_1 = Math.floor(Math.random() * n.length);
        t += n[e_1];
    }
    return t;
};
exports.randomHashN = randomHashN;
var randomHash = function () {
    return (0, exports.randomHashN)(12);
};
exports.randomHash = randomHash;
var wrapSymbol = function (symbol, chartType) {
    return "=" +
        JSON.stringify(chartType === "heikin-ashi"
            ? {
                inputs: {},
                symbol: { adjustment: "splits", symbol: symbol },
                type: "BarSetHeikenAshi@tv-basicstudies-60!",
            }
            : { adjustment: "splits", symbol: symbol });
};
exports.wrapSymbol = wrapSymbol;
exports.s = "~m~";
var readMessages = function (e) {
    var msgs = e.split(/~m~\d+~m~/);
    msgs = msgs.slice(1).map(function (v, i) {
        try {
            var parsed = JSON.parse(v);
            // console.warn("MSG::" + parsed.m);
            // if (v.length < 500) {
            // } else {
            //   fs.writeFileSync(
            //     path.resolve(
            //       __dirname,
            //       `../logs/${parsed.m}-${new Date().toISOString()}-${i}.json`
            //     ),
            //     JSON.stringify(parsed.p, null, 2)
            //   );
            // }
            return parsed;
        }
        catch (error) {
            return v;
        }
    });
    return msgs;
};
exports.readMessages = readMessages;
var isPing = function (v) {
    if (v === void 0) { v = ""; }
    return /~m~\d+~m~~h~\d+/.test(v);
};
exports.isPing = isPing;
var getT = function (v) { };
exports.getT = getT;
var getPineInputs = function (metaInfo, ind) {
    return metaInfo.inputs
        .map(function (v) {
        switch (v.id) {
            case "text":
                return [v.id, v.defval];
            case "pineId":
                return [v.id, ind.scriptIdPart];
            case "pineVersion":
                return [v.id, "".concat(ind.version)];
            default:
                return [
                    v.id,
                    {
                        v: v.defval,
                        f: v.isFake,
                        t: v.type,
                    },
                ];
        }
    })
        .map(function (_a) {
        var k = _a[0], v = _a[1];
        var vv = v;
        switch (vv === null || vv === void 0 ? void 0 : vv.t) {
            case "color":
                return [
                    k,
                    __assign(__assign({}, vv), { v: new color_utils_1.ColorTool(v === null || v === void 0 ? void 0 : v.v).argb }),
                ];
            default:
                return [k, v];
        }
    })
        .reduce(function (acc, _a) {
        var _b;
        var k = _a[0], v = _a[1];
        return (__assign(__assign({}, acc), (_b = {}, _b[k] = v, _b)));
    }, {});
};
exports.getPineInputs = getPineInputs;
var timescaleToOHLC = function (timescale) {
    var _a;
    return (_a = timescale === null || timescale === void 0 ? void 0 : timescale.s) === null || _a === void 0 ? void 0 : _a.map(function (_a) {
        var v = _a.v;
        return v;
    }).map(function (_a) {
        var t = _a[0], open = _a[1], high = _a[2], low = _a[3], close = _a[4], volume = _a[5];
        return ({
            time: t * 1000,
            dataset: timescale === null || timescale === void 0 ? void 0 : timescale.t,
            open: open,
            high: high,
            low: low,
            close: close,
            volume: volume,
        });
    });
};
exports.timescaleToOHLC = timescaleToOHLC;
var a = {
    m: "create_study",
    p: [
        "cs_JZ58WMscVJsf",
        "st4",
        "st1",
        "sds_1",
        "Script@tv-scripting-101!",
        {
            text: "+eVDRA9QoN6kquE0q/4kwA==_53QKXYtsO33xJipbYGn/v07fXrj1GZh0Ql8fn8EFFfdlO12jkW8CsIqzsGjjGPkBTv3j74mwamc2ZbLBtx6LpBkR6q5bWO6uVK3Dx6lVVee6Id5PxwAWF7T5Ihcnrk7xLQYB6aAQgY7V/urCTu1LD5loDrnm50EaHjfiveaVpbGQ+pKdhJAHWYUv9JBTWbMNxrppLdMdApzltyYFIJRvC0WIGXDs/+twGUaE2QHhYa2IywWc0uQXd2pWOs2jJiBJFR18l5lQYZuQ6ca0e41874FnsSx5jwqNcUO873hIQziB7jzgxA3brL4O9EVfU4/tJMxFP1RMD3PZVsFaRG4HOj8ts02p8vgWA6JEVl0Y5kedy9pAAeZz4d8nagHeAKb+4hdS1QnydWu8pgob4STF1pC2p2B8xMME0l/tLWN1F+UXMaBfWIr4Dk9PPcdS6LLPPwGUsUnCJU9TqBGpgbTWa3J83C67eg6M4Fx0jbpekHHOHQc6c717SSKeIOwWYQyaFIdyrgMsYo/KYhWEHp6VMDU1YYv1WV7DB2pp8Oy6W3NgihaUeGXsNLWylu7w281u4QkhSwMZOk6yve1C2l8rO438RcbXzwZax49elJmqXnx0cYOmsoptrzBL/n+Vane4G2XA156Xj8AItICMUKp8Wt0c5II2DmkzYJ4uNfMY7RxpcziWNkH5lijry0bqUYg+GJiKvWAleQjvCe22gLXsVAy4ZzpTyHn9TyfZllwbI+AmQ2olw2mJQU8itjHd87qSNkNzwMKdp8gnd8bE3uHZcmM/8mYsCwDsR4+AnB69egl9+KrbNb40AmaET5Nnn7Mc7AXFEF7zT6l/Gv7HY06Vc0w1Ab5AKemcv7FRVYe+QVosEnEi/xOahbYtwazMZZHzOEt9plSH64GVjwylc925zrKU08e6bK8FGDsCOE8i2AYMi6Co7MnoTj4HiXyoupwcER8X5vLlHcFAVZ/fjnAYsCfk80nWXRblzKDYQSDWjT2NeUyDdc+rtiVHs6TpabvRzQxoQrQ53NkxVkeOLsthvf3rpkgaxw+m3zTTHHTZ9PfTnF2Q64DdO2nd/uDtIyNKp57LxgJhFdDKpNdPRvyzEpFv8Jh0xYk0qCkvjA5XdaLzl3M9OCnbLVnsFT/jAWpoOXExsb+tZgmBt+P86bvFt59HT2pAeLs2QIIhTEv8YyIm6CWmEBKX0V01DGPPExn1Cy2Ewz7vCKermRXhgrHpDMKSIM8AHLmpL8J8HGW+J2OZQXDXKxsQyUb+jyZHZnXUFckmfCdhoSTB8nXvk9u6P4+tg4LipkZgPhcG2asTroCmtHWG9acYywUoT1O4ylHbzOtNWl3LY/507blYysx2X2g8HhODcqjFJx+m8J6keyGvq+K3HjqJSPpIXerzkPk/UdwQ51E6V9QoydBu8mP76cbn5muHJZTvHzkcp5fTslZDq/gYGB3c43+yOaG0pU/uyYFRgnmIO91VmiDORTr1T0NVMlMqE689lsLS/g10jna7zK2pYuGYX9JdEhu3ErSyCkNVw33II0XY1SJf1vZRa3YzlS6vi6tOC3vBg0Hrlm/sMLgoK0bHBh42CY2LEhgkh1sx6TEK3LEn4gdmdUfcG5ejMI+Jgk55iZLNgLX7TQcu13m6JpJBkRd8HxCy+gNxxp6p1SnvUiLIupjqPdsKNhRdOXSVKIOF0oAhypQ=",
            pineId: "PUB;G4Qy6kpt8uaS8eWhJrQeCwRkszRwcJUu",
            pineVersion: "4.0",
            in_12: { v: "", f: true, t: "resolution" },
            in_0: { v: true, f: true, t: "bool" },
            in_1: { v: "close", f: true, t: "source" },
            in_2: { v: 5, f: true, t: "integer" },
            in_3: { v: 10, f: true, t: "integer" },
            in_4: { v: 25, f: true, t: "integer" },
            in_5: { v: 35, f: true, t: "integer" },
            in_6: { v: 50, f: true, t: "integer" },
            in_7: { v: 75, f: true, t: "integer" },
            in_8: { v: 100, f: true, t: "integer" },
            in_9: { v: 150, f: true, t: "integer" },
            in_10: { v: "SMMA 2", f: true, t: "text" },
            in_11: { v: "SMMA 3", f: true, t: "text" },
        },
    ],
};
exports.duFixTimestamp = R.over(R.lensProp("st"), R.pipe(R.map(R.over(R.lensProp("v"), R.adjust(0, R.multiply(1000)))), R.map(R.over(R.lensProp("v"), R.map(R.when(R.equals(1e100), R.always(0)))))));
var mergeDataAndStudies = function (data, studies) {
    var s = studies.map(function (_a) {
        var _b;
        var data = _a.data, meta = _a.meta;
        return (_b = data === null || data === void 0 ? void 0 : data.st) === null || _b === void 0 ? void 0 : _b.filter(function (_a) {
            var i = _a.i;
            return i >= 0;
        }).map(function (_a) {
            var _b;
            var v = _a.v;
            return (_b = meta === null || meta === void 0 ? void 0 : meta.plots) === null || _b === void 0 ? void 0 : _b.reduce(function (acc, _a, idx) {
                var _b;
                var _c, _d, _e, _f;
                var id = _a.id;
                return ((_d = (_c = meta === null || meta === void 0 ? void 0 : meta.styles) === null || _c === void 0 ? void 0 : _c[id]) === null || _d === void 0 ? void 0 : _d.title)
                    ? __assign(__assign({}, acc), (_b = {}, _b["".concat(meta === null || meta === void 0 ? void 0 : meta.description, ":").concat((_f = (_e = meta === null || meta === void 0 ? void 0 : meta.styles) === null || _e === void 0 ? void 0 : _e[id]) === null || _f === void 0 ? void 0 : _f.title, "----").concat(id)] = v[idx + 1], _b)) : acc;
            }, {});
        });
    });
    return data.map(function (d, idx) { return (__assign(__assign({}, d), R.mergeAll(s.map(function (v) { return v[idx]; })))); });
};
exports.mergeDataAndStudies = mergeDataAndStudies;
var mergeMixedDataAndStudies = function (data, studies) {
    return R.pipe(R.groupBy(R.prop("dataset")), R.toPairs, R.map(function (_a) {
        var dataset = _a[0], values = _a[1];
        return (0, exports.mergeDataAndStudies)(values, studies.filter(function (v) { var _a; return (_a = v.id) === null || _a === void 0 ? void 0 : _a.startsWith(dataset); }));
    }), R.flatten)(data);
};
exports.mergeMixedDataAndStudies = mergeMixedDataAndStudies;
exports.getUniqueDatasets = R.pipe(R.pluck("dataset"), R.uniq);
