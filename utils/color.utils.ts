export class ColorTool {
  color: string | number;
  constructor(color: string | number) {
    this.color = color;
  }

  get isHex() {
    return typeof this.color === "string" && this.color.startsWith("#");
  }

  get isRGB() {
    return typeof this.color === "string" && this.color.startsWith("rgb");
  }

  get isRGBA() {
    return typeof this.color === "string" && this.color.startsWith("rgba");
  }

  get isARGB() {
    return typeof this.color === "number";
  }

  get hex() {
    if (this.isHex) {
      return this.color;
    } else if (this.isRGBA) {
      return this.rgba2hex(this.color as string);
    } else if (this.isRGB) {
      return this.rgb2hex(this.color as string);
    } else if (this.isARGB) {
      return this.argb2hex(this.color as number);
    }
  }

  get rgb() {
    if (this.isHex) {
      return this.hex2rgb(this.color as string);
    } else if (this.isRGBA) {
      return this.rgba2rgb(this.color as string);
    } else if (this.isRGB) {
      return this.color;
    } else if (this.isARGB) {
      return this.argb2rgb(this.color as number);
    }
  }

  get rgba() {
    if (this.isHex) {
      return this.hex2rgba(this.color as string);
    } else if (this.isRGBA) {
      return this.color as string;
    } else if (this.isRGB) {
      return this.rgb2rgba(this.color as string);
    } else if (this.isARGB) {
      return this.argb2rgba(this.color as number);
    }
  }

  get argb() {
    if (this.isHex) {
      return this.hex2argb(this.color as string);
    } else if (this.isRGBA) {
      return this.rgba2argb(this.color as string);
    } else if (this.isRGB) {
      return this.rgb2argb(this.color as string);
    } else if (this.isARGB) {
      return this.color;
    }
  }

  private hex2rgb(hex: string) {
    let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    return "rgb(" + r + "," + g + "," + b + ")";
  }

  private hex2rgba(hex: string) {
    let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16),
      a = parseInt(hex.slice(7, 9), 16) / 255;

    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }

  private hex2argb(hex: string) {
    let b = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      r = parseInt(hex.slice(5, 7), 16),
      a = parseInt(hex.slice(7, 9), 16);

    return (a << 24) | (r << 16) | (g << 8) | b;
  }

  private rgb2hex(rgb: string) {
    let rgbArr = rgb.replace("rgb(", "").replace(")", "").split(",");
    let r = parseInt(rgbArr[0]).toString(16);
    let g = parseInt(rgbArr[1]).toString(16);
    let b = parseInt(rgbArr[2]).toString(16);

    return "#" + r + g + b;
  }

  private rgb2rgba(rgb: string) {
    return rgb.replace("rgb", "rgba").replace(")", ",1)");
  }

  private rgb2argb(rgb: string) {
    let rgbArr = rgb.replace("rgb(", "").replace(")", "").split(",");
    let r = parseInt(rgbArr[0]);
    let g = parseInt(rgbArr[1]);
    let b = parseInt(rgbArr[2]);

    return (255 << 24) | (r << 16) | (g << 8) | b;
  }

  private rgba2hex(rgba: string) {
    let rgbaArr = rgba.replace("rgba(", "").replace(")", "").split(",");
    let r = parseInt(rgbaArr[0]).toString(16);
    let g = parseInt(rgbaArr[1]).toString(16);
    let b = parseInt(rgbaArr[2]).toString(16);
    let a = Math.round(parseFloat(rgbaArr[3]) * 255).toString(16);

    return "#" + r + g + b + a;
  }

  private rgba2rgb(rgba: string) {
    return rgba.replace("rgba", "rgb").replace(",1)", ")");
  }

  private rgba2argb(rgba: string) {
    let rgbaArr = rgba.replace("rgba(", "").replace(")", "").split(",");
    let r = parseInt(rgbaArr[0]);
    let g = parseInt(rgbaArr[1]);
    let b = parseInt(rgbaArr[2]);
    let a = Math.round(parseFloat(rgbaArr[3]) * 255);
    console.log(r,g,b,a);

    return (a << 24) | (b << 16) | (g << 8) | r;
  }

  private argb2hex(argb: number) {
    let a = ((argb >> 24) & 0xff).toString(16);
    let b = ((argb >> 16) & 0xff).toString(16);
    let g = ((argb >> 8) & 0xff).toString(16);
    let r = (argb & 0xff).toString(16);

    return "#" + r + g + b + a;
  }

  private argb2rgb(argb: number) {
    let b = (argb >> 16) & 0xff;
    let g = (argb >> 8) & 0xff;
    let r = argb & 0xff;

    return "rgb(" + r + "," + g + "," + b + ")";
  }

  private argb2rgba(argb: number) {
    let b = (argb >> 16) & 0xff;
    let g = (argb >> 8) & 0xff;
    let r = argb & 0xff;
    let a = ((argb >> 24) & 0xff) / 255;

    return "rgba(" + r + "," + g + "," + b + "," + a.toFixed(2) + ")";
  }
}

console.log(new ColorTool(1750284).hex)