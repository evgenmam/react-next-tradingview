"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subPercent = exports.addPercent = exports.val = exports.per = exports.cur = void 0;
var cur = function (n) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(n);
};
exports.cur = cur;
var per = function (n) { return "".concat((n * 100).toFixed(2), "%"); };
exports.per = per;
var val = function (n) { return Number(n.toFixed(2)); };
exports.val = val;
var addPercent = function (p) { return function (n) {
    return p > 1 ? n + (n * p) / 100 : n + n * p;
}; };
exports.addPercent = addPercent;
var subPercent = function (p) { return function (n) {
    return p > 1 ? n - (n * p) / 100 : n - n * p;
}; };
exports.subPercent = subPercent;
