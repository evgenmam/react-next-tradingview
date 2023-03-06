import * as R from "ramda";
import {
  MetaInfo,
  StudyData,
  TimescaleUpdate,
  Input,
  TVWSEvent,
  St,
} from "./types";
import { ITVIndicator } from "../components/tv-components/types";
import { ColorTool } from "../utils/color.utils";
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

export const wrapSymbol = (symbol: string, chartType?: string) =>
  "=" +
  JSON.stringify(
    chartType === "heikin-ashi"
      ? {
          inputs: {},
          symbol: { adjustment: "splits", symbol },
          type: "BarSetHeikenAshi@tv-basicstudies-60!",
        }
      : { adjustment: "splits", symbol }
  );

export const s = "~m~";
export const readMessages = (e: string): (string | TVWSEvent)[] => {
  let msgs = e.split(/~m~\d+~m~/);
  msgs = msgs.slice(1).map((v, i) => {
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
export const isPing = (v = "") => /~m~\d+~m~~h~\d+/.test(v);

export const getT = (v: string) => {};
export const getPineInputs = (metaInfo: MetaInfo, ind: ITVIndicator) =>
  metaInfo.inputs
    .map((v) => {
      switch (v.id) {
        case "text":
          return [v.id, v.defval];
        case "pineId":
          return [v.id, ind.scriptIdPart];
        case "pineVersion":
          return [v.id, `${ind.version}`];
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
    .map(([k, v]) => {
      const vv = v as any;
      switch (vv?.t) {
        case "color":
          return [
            k,
            { ...vv, v: new ColorTool((v as any)?.v! as string).argb },
          ];
        default:
          return [k, v];
      }
    })
    .reduce((acc, [k, v]) => ({ ...acc, [k as string]: v }), {});

export const timescaleToOHLC = (timescale: TimescaleUpdate) =>
  timescale?.s
    ?.map(({ v }) => v)
    .map(([t, open, high, low, close, volume]) => ({
      time: t * 1000,
      dataset: timescale?.t,
      open,
      high,
      low,
      close,
      volume,
    }));

const a = {
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

export const duFixTimestamp = R.over<StudyData, St[]>(
  R.lensProp("st"),
  R.pipe(
    R.map<St, St>(
      R.over<St, number[]>(R.lensProp("v"), R.adjust(0, R.multiply(1000)))
    ),
    R.map<St, St>(
      R.over<St, number[]>(
        R.lensProp("v"),
        R.map(R.when(R.equals(1e100), R.always(0)))
      )
    )
  )
);

export const mergeDataAndStudies = (
  data: { time: number; [i: string]: number }[],
  studies: { data: StudyData; meta: MetaInfo }[]
) => {
  const s = studies.map(({ data, meta }) =>
    data?.st
      ?.filter(({ i }) => i >= 0)
      .map(({ v }) =>
        meta?.plots?.reduce(
          (acc, { id }, idx) =>
            meta?.styles?.[id]?.title
              ? {
                  ...acc,
                  [`${meta?.description}:${meta?.styles?.[id]?.title}----${id}`]:
                    v[idx + 1],
                }
              : acc,
          {}
        )
      )
  );
  return data.map((d, idx) => ({ ...d, ...R.mergeAll(s.map((v) => v[idx])) }));
};

type SN = { time: number; [i: string]: number; dataset: number };

export const mergeMixedDataAndStudies = (
  data: { time: number; [i: string]: number; dataset: number }[],
  studies: { data: StudyData; meta: MetaInfo; id: string }[]
) =>
  R.pipe(
    R.groupBy<SN, any>(R.prop("dataset")),
    R.toPairs,
    R.map(([dataset, values]) =>
      mergeDataAndStudies(
        values as { time: number; [i: string]: number }[],
        studies.filter((v) => v.id?.startsWith(dataset))
      )
    ),
    R.flatten
  )(data);

export const getUniqueDatasets = R.pipe<
  { dataset: string }[][],
  string[],
  string[]
>(R.pluck("dataset"), R.uniq);
