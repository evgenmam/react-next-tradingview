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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHeikinAshi = exports.chartZoomScroll = exports.getTVLogo = exports.getLabelAxis = exports.getNextLabel = exports.syncExtremes = void 0;
var highcharts_1 = __importDefault(require("highcharts"));
var R = __importStar(require("ramda"));
var syncExtremes = function (e) {
    var thisChart = this.chart;
    if (e.trigger !== "syncExtremes") {
        // Prevent feedback loop
        highcharts_1.default.each(highcharts_1.default.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) {
                    // It is null while updating
                    chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
                        trigger: "syncExtremes",
                    });
                }
            }
        });
    }
};
exports.syncExtremes = syncExtremes;
var getNextLabel = function (label) { return ({
    zIndex: 0,
    value: 0,
    label: {
        text: label,
        style: {
            fontSize: "16px",
        },
        useHTML: true,
        y: 20,
    },
    width: 0,
}); };
exports.getNextLabel = getNextLabel;
var getLabelAxis = function (id, label, top, height) {
    if (top === void 0) { top = 24; }
    if (height === void 0) { height = 200; }
    return ({
        id: "".concat(id, "-left"),
        opposite: false,
        top: top,
        height: height,
        width: 0,
        panningEnabled: false,
        gridLineWidth: 0,
        left: 0,
        labels: {
            enabled: false,
        },
        zoomEnabled: false,
        title: {
            textAlign: "left",
            rotation: 0,
            text: label,
            align: "high",
            x: 30,
            y: 24,
            offset: 0,
            margin: 0,
            reserveSpace: false,
            style: {
                fontSize: "16px",
                fontWeight: "300",
            },
        },
    });
};
exports.getLabelAxis = getLabelAxis;
var getTVLogo = function (path) {
    return "https://s3-symbol-logo.tradingview.com/".concat(path, ".svg");
};
exports.getTVLogo = getTVLogo;
var chartZoomScroll = function (scrollEvent, chart, sensitivity) {
    var _a;
    if (sensitivity === void 0) { sensitivity = 0.4; }
    var ev = scrollEvent;
    ev.stopPropagation();
    ev.preventDefault();
    var pointerEvent = chart.pointer.normalize(ev);
    var point = (_a = chart === null || chart === void 0 ? void 0 : chart.series[0]) === null || _a === void 0 ? void 0 : _a.searchPoint(pointerEvent, true);
    if (point) {
        var extr = chart === null || chart === void 0 ? void 0 : chart.xAxis[0].getExtremes();
        var range = extr.max - extr.min;
        var margin = range * 0.03;
        if (ev.deltaY) {
            var percent = sensitivity * (ev.deltaY > 0 ? 1 : -1);
            var range_1 = extr.max - extr.min;
            var newRange = range_1 + range_1 * percent;
            var diff = (point.x - extr.min) / range_1;
            var newMin = point.x - newRange * diff;
            var newMax = newMin + newRange;
            var c = R.clamp(extr.dataMin - margin, extr.dataMax + margin);
            chart === null || chart === void 0 ? void 0 : chart.xAxis[0].setExtremes(c(newMin), c(newMax), undefined, false);
        }
        else if (ev.deltaX) {
            var percent = (sensitivity / 2) * (ev.deltaX > 0 ? 1 : -1);
            var range_2 = extr.max - extr.min;
            var newMin = extr.min + range_2 * percent;
            var newMax = extr.max + range_2 * percent;
            if (newMin <= extr.dataMin - margin) {
                chart === null || chart === void 0 ? void 0 : chart.xAxis[0].setExtremes(extr.dataMin, extr.dataMin + range_2, undefined, false);
            }
            else if (newMax >= extr.dataMax + margin) {
                chart === null || chart === void 0 ? void 0 : chart.xAxis[0].setExtremes(extr.dataMax - range_2, extr.dataMax, undefined, false);
            }
            else {
                chart === null || chart === void 0 ? void 0 : chart.xAxis[0].setExtremes(newMin, newMax, undefined, false);
            }
        }
    }
};
exports.chartZoomScroll = chartZoomScroll;
var toHeikinAshi = function (data) {
    return data
        .map(function (v, idx) {
        return data[idx - 1]
            ? __assign(__assign({}, v), { open: (data[idx - 1].open + data[idx - 1].close) / 2, close: (v.close + v.open + v.high + v.low) / 4 }) : v;
    })
        .map(function (v, idx) {
        return data[idx - 1]
            ? __assign(__assign({}, v), { high: Math.max(v.high, v.close, v.open), close: Math.min(v.low, v.close, v.open) }) : v;
    });
};
exports.toHeikinAshi = toHeikinAshi;
