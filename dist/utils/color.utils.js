"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorTool = void 0;
var ColorTool = /** @class */ (function () {
    function ColorTool(color) {
        this.color = color;
    }
    Object.defineProperty(ColorTool.prototype, "isHex", {
        get: function () {
            return typeof this.color === "string" && this.color.startsWith("#");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorTool.prototype, "isRGB", {
        get: function () {
            return typeof this.color === "string" && this.color.startsWith("rgb");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorTool.prototype, "isRGBA", {
        get: function () {
            return typeof this.color === "string" && this.color.startsWith("rgba");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorTool.prototype, "isARGB", {
        get: function () {
            return typeof this.color === "number";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorTool.prototype, "hex", {
        get: function () {
            if (this.isHex) {
                return this.color;
            }
            else if (this.isRGBA) {
                return this.rgba2hex(this.color);
            }
            else if (this.isRGB) {
                return this.rgb2hex(this.color);
            }
            else if (this.isARGB) {
                return this.argb2hex(this.color);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorTool.prototype, "rgb", {
        get: function () {
            if (this.isHex) {
                return this.hex2rgb(this.color);
            }
            else if (this.isRGBA) {
                return this.rgba2rgb(this.color);
            }
            else if (this.isRGB) {
                return this.color;
            }
            else if (this.isARGB) {
                return this.argb2rgb(this.color);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorTool.prototype, "rgba", {
        get: function () {
            if (this.isHex) {
                return this.hex2rgba(this.color);
            }
            else if (this.isRGBA) {
                return this.color;
            }
            else if (this.isRGB) {
                return this.rgb2rgba(this.color);
            }
            else if (this.isARGB) {
                return this.argb2rgba(this.color);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorTool.prototype, "argb", {
        get: function () {
            if (this.isHex) {
                return this.hex2argb(this.color);
            }
            else if (this.isRGBA) {
                return this.rgba2argb(this.color);
            }
            else if (this.isRGB) {
                return this.rgb2argb(this.color);
            }
            else if (this.isARGB) {
                return this.color;
            }
        },
        enumerable: false,
        configurable: true
    });
    ColorTool.prototype.hex2rgb = function (hex) {
        var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
        return "rgb(" + r + "," + g + "," + b + ")";
    };
    ColorTool.prototype.hex2rgba = function (hex) {
        var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16), a = parseInt(hex.slice(7, 9), 16) / 255;
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    };
    ColorTool.prototype.hex2argb = function (hex) {
        var b = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), r = parseInt(hex.slice(5, 7), 16), a = parseInt(hex.slice(7, 9), 16);
        return (a << 24) | (r << 16) | (g << 8) | b;
    };
    ColorTool.prototype.rgb2hex = function (rgb) {
        var rgbArr = rgb.replace("rgb(", "").replace(")", "").split(",");
        var r = parseInt(rgbArr[0]).toString(16);
        var g = parseInt(rgbArr[1]).toString(16);
        var b = parseInt(rgbArr[2]).toString(16);
        return "#" + r + g + b;
    };
    ColorTool.prototype.rgb2rgba = function (rgb) {
        return rgb.replace("rgb", "rgba").replace(")", ",1)");
    };
    ColorTool.prototype.rgb2argb = function (rgb) {
        var rgbArr = rgb.replace("rgb(", "").replace(")", "").split(",");
        var r = parseInt(rgbArr[0]);
        var g = parseInt(rgbArr[1]);
        var b = parseInt(rgbArr[2]);
        return (255 << 24) | (r << 16) | (g << 8) | b;
    };
    ColorTool.prototype.rgba2hex = function (rgba) {
        var rgbaArr = rgba.replace("rgba(", "").replace(")", "").split(",");
        var r = parseInt(rgbaArr[0]).toString(16);
        var g = parseInt(rgbaArr[1]).toString(16);
        var b = parseInt(rgbaArr[2]).toString(16);
        var a = Math.round(parseFloat(rgbaArr[3]) * 255).toString(16);
        return "#" + r + g + b + a;
    };
    ColorTool.prototype.rgba2rgb = function (rgba) {
        return rgba.replace("rgba", "rgb").replace(",1)", ")");
    };
    ColorTool.prototype.rgba2argb = function (rgba) {
        var rgbaArr = rgba.replace("rgba(", "").replace(")", "").split(",");
        var r = parseInt(rgbaArr[0]);
        var g = parseInt(rgbaArr[1]);
        var b = parseInt(rgbaArr[2]);
        var a = Math.round(parseFloat(rgbaArr[3]) * 255);
        return (a << 24) | (b << 16) | (g << 8) | r;
    };
    ColorTool.prototype.argb2hex = function (argb) {
        var a = ((argb >> 24) & 0xff).toString(16);
        var b = ((argb >> 16) & 0xff).toString(16);
        var g = ((argb >> 8) & 0xff).toString(16);
        var r = (argb & 0xff).toString(16);
        return "#" + r + g + b + a;
    };
    ColorTool.prototype.argb2rgb = function (argb) {
        var b = (argb >> 16) & 0xff;
        var g = (argb >> 8) & 0xff;
        var r = argb & 0xff;
        return "rgb(" + r + "," + g + "," + b + ")";
    };
    ColorTool.prototype.argb2rgba = function (argb) {
        var b = (argb >> 16) & 0xff;
        var g = (argb >> 8) & 0xff;
        var r = argb & 0xff;
        var a = ((argb >> 24) & 0xff) / 255;
        return "rgba(" + r + "," + g + "," + b + "," + a.toFixed(2) + ")";
    };
    return ColorTool;
}());
exports.ColorTool = ColorTool;
