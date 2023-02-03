import { Response } from "express";
// import { writeFileSync } from "fs";
import path from "path";
import pino from "pino";
import { v4 } from "uuid";
import { ITVIndicator } from "../../components/tv-components/types";
import TVClient, { TVClientC } from "../helpers/tv-client";
import TVApi from "../tradingview";
import { StudyData } from "../types";
import { getPineInputs, randomHash } from "../utils";

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

  getSymbol = async (symbol: string, interval = "1W", count = 300) => {
    const symbol_id = symbol.replace(":", "::");
    tvc.send("resolve_symbol", [this.session, symbol_id, symbol]);
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
