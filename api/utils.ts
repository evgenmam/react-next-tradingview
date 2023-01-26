import * as R from "ramda";
import fs from "fs";
import path from "path";
import { v4 } from "uuid";
const n = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const hashh = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const t = (16 * Math.random()) | 0;
    return ("x" === e ? t : (3 & t) | 8).toString(16);
  });
};

export const randomHashN = (e: number) => {
  let t = "";
  for (let o = 0; o < e; ++o) {
    const e = Math.floor(Math.random() * n.length);
    t += n[e];
  }
  return t;
};

export const randomHash = () => {
  return randomHashN(12);
};

export const s = "~m~";
export const readMessages = (e: string) => {
  let msgs = e.split(/~m~\d+~m~/);
  msgs = msgs.map((v, i) => {
    try {
      const parsed = JSON.parse(v);
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
    } catch (error) {
      return v;
    }
  });
  return msgs;
};

export const getPineInputs = (val: Record<string, any>) =>
  Object.keys(val)
    .filter((v) => v.startsWith("in_"))
    .reduce((acc, v) => {
      const r = val[v as keyof typeof val];
      return {
        ...acc,
        [v]: {
          v: r,
          f: true,
          t:
            typeof r === "number"
              ? "integer"
              : typeof r === "boolean"
              ? "bool"
              : "text",
        },
      };
    }, {});
