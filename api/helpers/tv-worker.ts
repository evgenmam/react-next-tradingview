import { v4 } from "uuid";
import { ITVIndicator } from "../../components/tv-components/types";
import TVApi from "../tradingview";
import { getPineInputs, randomHash } from "../utils";
import TVClient, { TVClientC } from "./tv-client";

const client = new TVClient();

const splits = (symbol: string) =>
  `=${JSON.stringify({
    adjustment: "splits",
    symbol,
  })}`;
export class TvAPIWorker {
  chartSession: string;
  quoteSession: string;
  constructor() {
    this.chartSession = `cs_${randomHash()}`;
    this.quoteSession = `qs_${randomHash()}`;
  }

  init = async () => {
    const results = await TVApi.login();
    const chartprops = JSON.parse(results?.user?.settings?.chartproperties);
    await client.init(results.user.auth_token);
    await client.send("set_locale", ["en", "US"]);
    await client.send("chart_create_session", [this.chartSession]);
    await client.send("switch_timezone", [
      this.chartSession,
      chartprops?.timezone,
    ]);
    await client.send("quote_create_session", [this.quoteSession]);
  };

  getSymbolData = ({
    symbol,
    indicators = [],
  }: {
    symbol: string;
    indicators?: ITVIndicator[];
  }) =>
    new Promise(async (resolve, reject) => {
      client.listen("timescale_update", (data) => {
        const d = data[1];
        try {
          resolve(
            Object.values((Object.values(d)?.[0] as any)?.s)?.map(
              ({ v }: any) => ({
                time: v[0] * 1000,
                open: v[1],
                high: v[2],
                low: v[3],
                close: v[4],
                volume: v[5],
                dataset: symbol,
              })
            )
          );
        } catch (error) {
          reject(error);
        }
      });
      await this.addQuote(symbol);
      const symbol_id = await this.resolveSymbol(symbol);
      const series_id = await this.createSeries(symbol_id);
    });

  getIndicatorData = ({
    symbol,
    indicator,
  }: {
    symbol: string;
    indicator: ITVIndicator;
  }) =>
    new Promise(async (resolve, reject) => {
      await this.addQuote(symbol);
      const symbol_id = await this.resolveSymbol(symbol);
      const series_id = await this.createSeries(symbol_id);
      const fields = await this.addIndicator(series_id, indicator);
      client.listen("du", (data) => {
        const d = data[1];
        try {
          resolve(
            Object.values((Object.values(d)?.[0] as any)?.st)?.map(
              ({ v }: any) => ({
                time: v[0] * 1000,
                ...fields
                  .map((f, i) => ({ [f]: v[i + 1] }))
                  .reduce((a, b) => ({ ...a, ...b }), {}),
              })
            )
          );
        } catch (error) {
          reject(error);
        }
      });
    });

  addQuote = async (symbol: string) => {
    await client.send("quote_add_symbols", [this.quoteSession, symbol]);
  };

  resolveSymbol = async (symbol: string, symbol_id?: string) => {
    const id = symbol_id || v4();
    await client.send("resolve_symbol", [this.chartSession, id, symbol]);
    return id;
  };

  createSeries = async (
    symbol_id: string,
    series_id?: string,
    interval = "1W",
    count = 300
  ) => {
    const s_id = series_id || v4();
    await client.send("create_series", [
      this.chartSession,
      s_id,
      "s1",
      symbol_id,
      interval,
      300,
      "",
    ]);
    return s_id;
  };

  fastQuote = async (symbol: string) => {
    await client.send("quote_fast_symbols", [this.quoteSession, symbol]);
  };

  createStudy = async (series_id: string, data: any, study_id?: string) => {
    const s_id = study_id || v4();
    await client.send("create_study", [
      this.chartSession,
      s_id,
      "st1",
      series_id,
      "Script@tv-scripting-101!",
      data,
    ]);
    return study_id;
  };

  addIndicator = async (symbol_id: string, indicator: ITVIndicator) => {
    const res = await TVApi.translateIndicator(indicator);
    const fields = Object.values(res?.result?.metaInfo?.styles)?.map?.(
      (v: any) => v?.title
    );
    const data = {
      text: res.result.metaInfo.defaults.inputs.text,
      pineId: indicator.scriptIdPart,
      pineVersion: `${indicator.version}.0`,
      pineFeatures: {
        t: "text",
        f: true,
        v: res.result.metaInfo.defaults.inputs.pineFeatures,
      },
      ...getPineInputs(res.result.metaInfo.defaults.inputs),
    };

    this.createStudy(symbol_id, data);
    return fields;
  };
}
