import { Response } from "express";
// import { writeFileSync } from "fs";
import path from "path";
import pino from "pino";
import { v4 } from "uuid";
import { ITVIndicator } from "../../components/tv-components/types";
import TVClient, { TVClientC } from "../helpers/tv-client";
import TVApi from "../tradingview";
import { MetaInfo, StudyData } from "../types";
import {
  getPineInputs,
  getUniqueDatasets,
  mergeMixedDataAndStudies,
  randomHash,
  timescaleToOHLC,
  wrapSymbol,
} from "../utils";

const tvc = new TVClient();

export class TVMarketData {
  chartSession: string;
  quoteSession: string;
  constructor() {
    this.chartSession = `cs_${randomHash()}`;
    this.quoteSession = `qs_${randomHash()}`;
  }
}

class TVSession {
  hc() {
    return new Promise<void>(async (resolve, reject) => {
      if (tvc.ws.readyState !== tvc.ws.OPEN) {
        tvc.ws.on("open", () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class TVChartSession extends TVSession {
  session: string;
  res?: Response;
  constructor(res?: Response) {
    super();
    this.res = res;
    this.session = `cs_${randomHash()}`;
    pino({ name: "TVChartSession" }).info({ session: this.session });
  }

  init = async () => {
    if (!tvc.loggedIn) await tvc.login();
    await this.hc();
    await tvc.send("chart_create_session", [this.session]);
    tvc.onError(this.session).then((v) => {
      this.cleanup();
      this.res?.status?.(410)?.send(v);
    });
  };

  cleanup = (symbol?: string) => {
    if (symbol) tvc.send("remove_series", [this.session, symbol]);
    tvc.clearListeners(this.session);
  };

  waitFor = (...msg: string[]) => tvc.waitFor(this.session, ...msg);
  waitForMax = (ms: number, fallback = [], ...msg: string[]) =>
    new Promise((resolve) => {
      tvc.waitFor(this.session, ...msg).then(resolve);
      setTimeout(() => resolve(fallback), ms);
    });

  subscribe = (cb: (...args: any[]) => void, ...msg: string[]) =>
    tvc.subscribe(cb, this.session, ...msg);

  ssend = (msg: string, ...args: (string | number)[]) =>
    tvc.send(msg, [this.session, ...args]);

  getSymbol = async (
    symbol: string,
    interval = "1W",
    count = 300,
    chartType = "candlestick"
  ) => {
    const symbol_id = symbol.replace(":", "::");
    tvc.send("resolve_symbol", [
      this.session,
      symbol_id,
      wrapSymbol(symbol, chartType),
    ]);
    await this.waitFor(symbol_id, "symbol_resolved");
    tvc.send("create_series", [
      this.session,
      symbol,
      symbol,
      symbol_id,
      interval,
      count,
      "",
    ]);

    const data = this.waitFor(symbol, "timescale_update");
    return data;
  };

  getIndicator = async (symbol: string, ind: ITVIndicator) => {
    const res = await TVApi.translateIndicator(ind);
    // writeFileSync(
    //   path.resolve("logs", ind.scriptName + ".json"),
    //   JSON.stringify(res, null, 2)
    // );
    const fields = Object.values(res?.result?.metaInfo?.styles)?.map?.(
      (v: any) => v?.title
    );
    const sd = res?.result?.metaInfo?.shortDescription;
    const data = getPineInputs(res.result.metaInfo, ind);

    await tvc.send("create_study", [
      this.session,
      ind.scriptName,
      ind.scriptName,
      symbol,
      "Script@tv-scripting-101!",
      data,
    ]);
    // writeFileSync(
    //   path.resolve("logs", ind.scriptName + "-data.json"),
    //   JSON.stringify(data)
    // );
    const values = await this.waitFor(ind.scriptName, "du");
    await tvc.send("remove_study", [this.session, ind.scriptName]);
    return {
      data: values,
      meta: res.result.metaInfo,
      id: (values as StudyData)?.t,
    };
  };

  getBulkData = async ({
    nums = [],
    dens = [],
    indicators = [],
    period = "1W",
    count = 300,
    chartType = "candlestick",
  }: {
    nums: string[];
    dens: string[];
    indicators: ITVIndicator[];
    period: string;
    count: number;
    chartType: string;
  }) => {
    let series_id;
    let rows: Record<string, any>[] = [];
    let uns: (() => {})[] = [];
    for (const s of [...nums, ...dens]) {
      const symbol_id = s.replace(":", "::");
      this.ssend("resolve_symbol", symbol_id, wrapSymbol(s, chartType));
      await this.waitFor(symbol_id, "symbol_resolved");
      if (!series_id) {
        series_id = v4();
        this.ssend(
          "create_series",
          series_id,
          s,
          symbol_id,
          period,
          +count,
          ""
        );
        uns.push(
          this.subscribe((d) => rows.push(...d), series_id, "timescale_update")
        );
      } else {
        this.ssend("modify_series", series_id, s, symbol_id, period, "");
      }
      await this.waitFor(series_id, "series_completed");
    }

    let studies: Record<string, any> = [];
    const studyMeta: Record<string, any> = {};
    for (const i of indicators) {
      const res = await TVApi.translateIndicator(i);

      const data = getPineInputs(res.result.metaInfo, i);

      studyMeta[i.scriptName] = res.result.metaInfo;
      await tvc.send("create_study", [
        this.session,
        i.scriptName,
        i.scriptName,
        series_id,
        "Script@tv-scripting-101!",
        data,
      ]);
    }
    if (series_id)
      for (const s of nums) {
        for (const d of dens) {
          const symbol = `${s}/${d}`;
          const symbol_id = symbol.replace(":", "::");
          this.ssend(
            "resolve_symbol",
            symbol_id,
            wrapSymbol(symbol, chartType)
          );
          await this.waitFor(symbol_id, "symbol_resolved");
          this.ssend("modify_series", series_id, symbol, symbol_id, period, "");

          studies.push(
            ...(await Promise.all(
              indicators.map(
                (i) =>
                  new Promise(async (resolve) => {
                    const du = await this.waitFor(i.scriptName, "du");
                    //@ts-ignore
                    resolve({
                      data: du,
                      meta: studyMeta[i.scriptName],
                      id: (du as StudyData)?.t,
                    });
                  })
              )
            ))
          );
        }
      }
    await wait(3000);
    uns?.forEach((u) => u?.());
    return {
      data: mergeMixedDataAndStudies(
        rows as { time: number; [i: string]: number; dataset: number }[],
        studies as { data: StudyData; meta: MetaInfo; id: string }[]
      ),
      datasets: getUniqueDatasets(rows as { dataset: string }[]),
      studies,
    };
  };
}

export class TVQuoteSession extends TVSession {
  session: string;
  constructor() {
    super();
    this.session = `qs_${randomHash()}`;
  }

  init = async () => {
    await this.hc();
    await tvc.send("quote_create_session", [this.session]);
  };

  addSymbol = async (symbol: string) => {
    await tvc.send("quote_add_symbols", [this.session, symbol]);
  };
}

export const reconnect = () => {
  tvc.reconnect();
};

export const status = () => {
  return tvc.ws.readyState;
};
