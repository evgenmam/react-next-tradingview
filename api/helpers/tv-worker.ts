import { v4 } from "uuid";
import { ITVIndicator } from "../../components/tv-components/types";
import TVApi from "../tradingview";
import { getPineInputs, randomHash } from "../utils";
import TVClient, { TVClientC } from "./tv-client";
const splits = (symbol: string) =>
  `=${JSON.stringify({
    adjustment: "splits",
    symbol,
  })}`;
export class TvAPIWorker {
  chartSession: string;
  quoteSession: string;
  client: TVClientC;
  constructor() {
    this.client = new TVClient();
    this.chartSession = `cs_${randomHash()}`;
    this.quoteSession = `qs_${randomHash()}`;
  }

  init = async () => {
    const results = await TVApi.login();
    const chartprops = JSON.parse(results?.user?.settings?.chartproperties);
    await this.client.init(results.user.auth_token);
    await this.client.send("set_locale", ["en", "US"]);
    await this.client.send("chart_create_session", [this.chartSession]);
    await this.client.send("switch_timezone", [
      this.chartSession,
      chartprops?.timezone,
    ]);
    await this.client.send("quote_create_session", [this.quoteSession]);
  };

  getSymbolData = ({
    symbol,
    indicators = [],
  }: {
    symbol: string;
    indicators?: ITVIndicator[];
  }) =>
    new Promise(async (resolve, reject) => {
      this.client.listen("timescale_update", (data) => {
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
      this.client.listen("du", (data) => {
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
    await this.client.send("quote_add_symbols", [this.quoteSession, symbol]);
  };

  resolveSymbol = async (symbol: string, symbol_id?: string) => {
    const id = symbol_id || v4();
    await this.client.send("resolve_symbol", [this.chartSession, id, symbol]);
    return id;
  };

  createSeries = async (
    symbol_id: string,
    series_id?: string,
    interval = "1W",
    count = 300
  ) => {
    const s_id = series_id || v4();
    await this.client.send("create_series", [
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
    await this.client.send("quote_fast_symbols", [this.quoteSession, symbol]);
  };

  createStudy = async (series_id: string, data: any, study_id?: string) => {
    const s_id = study_id || v4();
    await this.client.send("create_study", [
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

  disconnect = async () => {
    await this.client.disconnect();
  };
}

// ~m~526~m~{"m":"set_auth_token","p":["eyJhbGciOiJSUzUxMiIsImtpZCI6IkdaeFUiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjo0OTQ2MDI1OCwiZXhwIjoxNjc0MjcyMDE5LCJpYXQiOjE2NzQyNTc2MTksInBsYW4iOiIiLCJleHRfaG91cnMiOjEsInBlcm0iOiIiLCJzdHVkeV9wZXJtIjoiIiwibWF4X3N0dWRpZXMiOjMsIm1heF9mdW5kYW1lbnRhbHMiOjAsIm1heF9jaGFydHMiOjEsIm1heF9hY3RpdmVfYWxlcnRzIjoxLCJtYXhfc3R1ZHlfb25fc3R1ZHkiOjF9.SjBQpGD7JgOutpxC8-1Dmh4y3hkAKq87GwZZbIoXYa_XuOLaYx4Ill5Il9I7rYAfKsxe0GdS0RG-HWTLdvdbZch1vHlSySHxjrFWnRJozovuCzVthPMgdgV3awhOeI7HfeKr48eVxjCPBSCANa0S0rJDwRFVEVyZB7d-A3rx5lM"]}
// ~m~34~m~{"m":"set_locale","p":["en","US"]}
// ~m~55~m~{"m":"chart_create_session","p":[this.chartSession,""]}

// ~m~57~m~{"m":"switch_timezone","p":[this.chartSession,"Etc/UTC"]}
// ~m~52~m~{"m":"quote_create_session","p":["qs_7I40x6VjZyre"]}
// ~m~107~m~{"m":"quote_add_symbols","p":["qs_7I40x6VjZyre","={\"adjustment\":\"splits\",\"symbol\":\"NASDAQ:AAPL\"}"]}
// ~m~116~m~{"m":"resolve_symbol","p":[this.chartSession,"sds_sym_1","={\"adjustment\":\"splits\",\"symbol\":\"NASDAQ:AAPL\"}"]}

// ~m~81~m~{"m":"create_series","p":[this.chartSession,"sds_1","s1","sds_sym_1","D",300,""]}
// ~m~132~m~{"m":"create_study","p":[this.chartSession,"st1","st1","sds_1","BarSetContinuousRollDates@tv-corestudies-18",{"currenttime":"now"}]}
// ~m~52~m~{"m":"quote_create_session","p":["qs_1ZP4osvellMu"]}
// ~m~432~m~{"m":"quote_set_fields","p":["qs_1ZP4osvellMu","base-currency-logoid","ch","chp","currency-logoid","currency_code","currency_id","base_currency_id","current_session","description","exchange","format","fractional","is_tradable","language","local_description","listed_exchange","logoid","lp","lp_time","minmov","minmove2","original_name","pricescale","pro_name","short_name","type","typespecs","update_mode","volume","value_unit_id"]}
// ~m~63~m~{"m":"quote_add_symbols","p":["qs_1ZP4osvellMu","NASDAQ:AAPL"]}
// ~m~83~m~{"m":"quote_create_session","p":["qs_snapshoter_basic-symbol-quotes_vARzw7lhCwh0"]}
// ~m~323~m~{"m":"quote_set_fields","p":["qs_snapshoter_basic-symbol-quotes_vARzw7lhCwh0","pro_name","base_name","short_name","description","type","exchange","typespecs","listed_exchange","country_code","provider_id","symbol-primaryname","logoid","base-currency-logoid","currency-logoid","update_mode","source","source2","pricescale"]}
// ~m~90~m~{"m":"quote_add_symbols","p":["qs_snapshoter_basic-symbol-quotes_vARzw7lhCwh0","TVC:NDX"]}
// ~m~94~m~{"m":"quote_add_symbols","p":["qs_snapshoter_basic-symbol-quotes_vARzw7lhCwh0","NASDAQ:AAPL"]}
// ~m~108~m~{"m":"quote_fast_symbols","p":["qs_7I40x6VjZyre","={\"adjustment\":\"splits\",\"symbol\":\"NASDAQ:AAPL\"}"]}
// ~m~64~m~{"m":"quote_fast_symbols","p":["qs_1ZP4osvellMu","NASDAQ:AAPL"]}

const a = {
  m: "create_study",
  p: [
    "cs_tOe53VGY5hPb",
    "st9",
    "st1",
    "sds_1",
    "Script@tv-scripting-101!",
    {
      text: "m6UYKL492UkMlqE3WXH5gA==_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",
      pineId: "PUB;8bBrCmCGspE390DLRNWYlXrtDxRIoZYe",
      pineVersion: "12.0",
      pineFeatures: {
        v: '{"indicator":1,"plot":1,"str":1,"array":1,"ta":1,"math":1,"alertcondition":1,"line":1,"label":1}',
        f: true,
        t: "text",
      },
      in_0: { v: "Ultimate Stochastic", f: true, t: "text" },
      in_1: { v: 17, f: true, t: "integer" },
      in_2: { v: true, f: true, t: "bool" },
      in_3: { v: 12, f: true, t: "integer" },
      in_4: { v: 26, f: true, t: "integer" },
      in_5: { v: 9, f: true, t: "integer" },
    },
  ],
};
const b = {
  success: true,
  reason2: {
    warnings: [
      {
        end: { column: 60, line: 354 },
        message:
          "The division of two `const int` values yields a rounded down `int` value. If you require a `float` result, cast one of the values to `float`: `float(int1) / int2`.",
        start: { column: 57, line: 354 },
      },
      {
        end: { column: 59, line: 355 },
        message:
          "The division of two `const int` values yields a rounded down `int` value. If you require a `float` result, cast one of the values to `float`: `float(int1) / int2`.",
        start: { column: 56, line: 355 },
      },
    ],
  },
  result: {
    IL: "w9zFTTAkVV4/Q3OHxgeBDA==_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",
    ilTemplate:
      "m6UYKL492UkMlqE3WXH5gA==_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",
    metaInfo: {
      TVScriptMetaInfoExprs: {
        patchMap: {
          "defaults.bands.0.value": "rm_0",
          "defaults.bands.1.value": "rm_7",
          "defaults.bands.2.value": "rm_8",
        },
        tree: "//@version=5\ntype=##input(defval='Ultimate Stochastic',type='INPUT_STRING',##id='in_0')\ndynamic=##input(defval=true,type='INPUT_BOOL',##id='in_2')\ntype_macd=(type=='Ultimate MACD')\nvar type_rsi=(type=='Ultimate RSI')\n##root(root_metainfo,rm_0,(type_rsi?50:na),input__float)\n##root(root_metainfo,rm_1,'shape_label_up',input__string,plotshape,style)\n##root(root_metainfo,rm_2,'Absolute',input__string,plotshape,location)\n##root(root_metainfo,rm_3,'tiny',const__string,plotshape,size)\n##root(root_metainfo,rm_4,'shape_label_down',input__string,plotshape,style)\n##root(root_metainfo,rm_5,'Absolute',input__string,plotshape,location)\n##root(root_metainfo,rm_6,'tiny',const__string,plotshape,size)\nvar type_pivot=(type=='Pivot')\n##root(root_metainfo,rm_7,(type_rsi?70:(((dynamic or type_macd) or type_pivot)?na:70)),input__float)\n##root(root_metainfo,rm_8,(type_rsi?30:(((dynamic or type_macd) or type_pivot)?na:30)),input__float)\n",
      },
      _metainfoVersion: 53,
      bands: [
        { id: "hline_0", isHidden: false, name: "URSI Baseline" },
        { id: "hline_1", isHidden: false, name: "Overbought Fixed Level" },
        { id: "hline_2", isHidden: false, name: "Oversold Fixed Level" },
      ],
      defaults: {
        bands: [
          {
            color: "rgba(120,123,134,0.5)",
            linestyle: 2,
            linewidth: 1,
            value: null,
            visible: true,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            value: null,
            visible: true,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            value: null,
            visible: true,
          },
        ],
        filledAreasStyle: {
          fill_0: { color: "#2962ff", transparency: 0, visible: true },
          fill_1: { color: "#2962ff", transparency: 0, visible: true },
          fill_2: { color: "#2962ff", transparency: 0, visible: true },
          fill_3: { color: "#2962ff", transparency: 0, visible: true },
        },
        graphics: {
          dwglabels: { labels: { visible: true } },
          dwglines: { lines: { visible: true } },
        },
        inputs: {
          in_0: "Ultimate Stochastic",
          in_1: 17,
          in_2: true,
          in_3: 12,
          in_4: 26,
          in_5: 9,
          pineFeatures:
            '{"indicator":1,"plot":1,"str":1,"array":1,"ta":1,"math":1,"alertcondition":1,"line":1,"label":1}',
          pineId: "",
          pineVersion: "",
          text: "m6UYKL492UkMlqE3WXH5gA==_jgO2pYlUNXJiGUmv9TAA3tcAyyIofTwxbzXfArn/niMx8XeF3nYXrhiHRiIcSOVKJoqIL1P1WUaJlLYceihFrt311SsWlTA3nkW+UWm3mMRQaZBFeUjYpiRNn8FXeYnC8ThJj0V0EBm1PghHDrA4jvCdTEvurTztsfQnUVrGxHeh/AijXW7rpBXvb5cqdcNL4+H9hJsSzYZDZ4EFIQuqpeWCWwVv3qA98zhFJGInbh+vl7S6mK907j+qCWfWyuaqfFfaba+DkvO2+omcskx7IlKLpWLupRZhAsrvO5tNM2vUqm+kjlWU3S8Z0Arp11HTxMLXM8o+BOf3TdCYZ4vZ4R11OTMhtqEMttWeFVjOqp5HCkle3MnLe5IqyM+su8LEN5hkhp+YzKtIWKAA7bJq8905yXiF+F5RflbtfL2RhDv88r5y9erUVgX0UPnXsSFAb+K/RrwUPoYu6aHO6N4fN9S7BuucC/ndOYK4JTWbVV/sTARVXZOZ2+zJZYBr3LkkSseDaF6wWtJiF/hRIwv5ADq16y/RNtFkgBw7odCsgQjJRJR8AHYJpnqWv/IIJPyyTUX/FUXuqybBhZe5fcu3uKN4t70inO0disVe+Ub/tJ2r5nIGJ64L4NRjZjPXjEc7gZ2fAzUQ1PwS+M0v3+HVzewS0QiKJLDya5d7quT194yoKhnRoXidBkqF817sX7lilDVdfgqojm5zpQ7izQ9wsnP30FT8npWz1HvsF+iBvoE01S2ogncrzNzaWCdpzlILxo3C1YEvN7sLU9tf6ZvewLBNYODNnPBZ4Zm9VUaOGiPnFgqLtvVH5OZ9+tMQm7qLHL9RCGhjy4jFUSSQqBql9+jDv4/JNAK00Sy4yH8PhGbE+lFEH7tOBMhho4UkyRhaWIcV3iFL8xzp/rzBslcIAbeoeKTK4umQocCN1tO0hDOhG7Qssq/uQ7tvGJAmLebRNMmyVayTEAHqNexaoGUV+gyGONwR1NiArNzKSchzxJ6dSGnizMstXGhVSuN8dwfPkX8KkoA0zy3YLEY2AOLveXCwDmUnQqylkDtz+1YEKcJFgAW7iLkrE4HCuTOp4+pXoLBJJ4iAwvyMP3cSrysMw8g9qPw490RpzsDgoz8asFzRMOywWMU1Xntyiwc5dq7S3J/qjXmgb4+VucN0+l+y2sEkDw8s9EgwHoeVmFSlAlAEQYoMLALXsi1liXdS95MQepynx2tqJO6A0actPf3kpehgrAzDH4v6fht9Jb2X63xtzxNerauxr4k6re5Ver1oreC2DfLju4i6GJ+HaQ0laf57FOR5KDyD9E0sVZb0YncGkh6vkQNzreqjPcaA1ML6hJf0Vb47+DxGG+pI9qzHX5Ku6xjEBISToVNnO+sewWhgQ/gCnGLnuhyHqNMu1i9gPyFPpvQ1yAkvf5r4o9XlVgdnij8kpQ4mOYQFn9HdR2cCBOpI+btNsJlxZY5whjBmVeOdAxaEm+Hqh+rYpcW8QSsXaOAiXj8tGrvGdILtTlI20qCMiFo2DQ6qyLo8n3rgJBgIViSejS0iU85MvQjvvFY4BpktFmyEeGlKA+IYruIvJnMN6EaQB3IXpvSUu7ErPZIDmIDAMzwdon/fdt9C28w3h2HsVvIvEKVHA4LfqIkSt+OMhJ8wKbeZEyCdsnH4mOWap3OWDJHIsF1cOGie4oaBZtgZep8gILja6jMlXtYCBfaAJrpP3EwfHWuoiUaVlQLKossISpglbZw34p8nAZDeMN8ssJI/M/kLFy9yOQpCSzttnWI5c4/895ar891zY5v1M5XW93BT+rU6uZmGsLlT8fXbw5ytfv8Ij9rWoVzv+V+O98a4vNWT4TqdNnKVKdU8r1qwZ8ocaaj507GE4it0/LEANfvh84DsgTxCimH2bb0Bit3/usYtjYZxm4RoKbweMZC1Ua8roMWC6ZPb+aVNtl39fv8I5NQ831FyIn7ChFxnQH5bQrRDv5lrHQjHoL5AOXL12DHxp0YNU4gjvpqhIux2h86ye/X03aK9yC57knuKzLnqjd7nDChjq/Ak2hh/PlGfzfiKhV9fQH/7ngGLZO9Dzwr7dGhy9kj8+IVWkQ/t25Yhz+ecVZ46OKVGV+RzDHsIYYabfo9pi6F/GzPEHLjodkWP57BhumJb+AsXrze7sIQj795FTbAK+Up/2Egd3P/GuwDn4fAjhquyEpyWIQc2To0JYVGWhUf+dXEJbSGu9fwEuR19rsAhsh7Ae6sEa9XcBz04dKLnp2BO53G5ZVw/4KCN4AOQV0fHF/Qk0bSqLS9vhlqv2Zn07+x66TCY0fyXSGMe7iSFfEraYKDyNsXXGiu5ZyHq8ldEHgHDDWxUyBPagsApIfXvejOtPlfLSKcSf57mmWM/fEJRFMbOsARoLxtgdS1HkfL+p+dG562H356lT9dnTtBqC1ohteclAsE2FPGMWXKzla9Kzo4CDGwujInYIeCy2MfZC9HTEh3pXc76j3zg/vp1zZ7K0h0Gr5Hf5WhCTMBON456rBi39i9+p9NtxtPTMdI1m5ffxp9uA0rt9xY8puQFIejawdrVYvUhQ9/wtof3xALdnlfy1FnWu5lYKoLet3Ea7cpUnue7VyIH7wYrnqzl3MWtBVz2ZVuYvu+OpiAHOfXPr97n4GqFMsoaKGTdj0OCAPkhRv88hS01fO+KeiANPVuR8CoywQeNYBOCj0+VDXX3pMjRCtHiagStW+SOr3vpZznsh90jPCfL99H1m0MBDsi/kxJsnwLIX//8LGfDbnDPGnKtkmM0jVQGUSVafCmOXl83ea+qDalzxVLJ1S7QIn3hDOcxZPDJdjlVMPghaaSUXwymyzj1nNQIvBixNp8Leg+nSU6aRXAXsYCG0pVS3h2I+V7O8mSrmIEDKrtBRC0EsQa2TSPXhYyYYAsB9wszvzeJX4XvsyPx9X7rsKELpyi9JK+k7dlS2WrODgtKE9i+44tSBJF6hW1B78Dq4dBu6GC5/zkC4QzthlDIombiUdNme6xR++O0U+eyi9Nmpxq8In0J75dO1z25UZyAi/5ECzHTqJ21R2h8a9wS1KATl64fcDnFRP1PBxNYv33+fDwNKlTrznVBVBfPPcONiAW0SrgBL6JGlvWAfb3jvNX2hMu+gB9k8ALFlrG1iFUE0w8R+jFwuk7PR8aCeN4QmFoEtFCeH5Ufa1RBepXOVmRS5PFi9g7Nqz2xsybTlTWO/7zlga806YUY+1I6cIyWTH2Us1WKfgGRSY4urpDS1D7AkbBnELVNjRV5AG/zEtPOIT2Qx9vuKJs1fkNuUAarBG5buEmyBsObzE6U2R1olaDKOlB/sS9uJJ7cWGGNVTmRIKA60+QYQo4lKxKjWbmSpFbea0LELEVZuvuHsyrc186PFvv/cxv3MHFBZUpLakUZTosJldjI9uChVVWmfzOjT2euMsIoX9yibVQAJb/zqc6UUvOIpUhDWJBOPcUxbBNvs+hQX29FwxmFetdLiOlwNzMSRODUACZhSMulngOt3UMeZ6t3HrvgGi3yIgjzWoeh95BgG8olr6FRyEZtrPKWp4nyc3xcssKA4/IhUZR2FFxt/FQ+t98bAkHzUzovnDZEdiWJP10WM6EqzNSbubexUW7cPUHHyyr+w5hVqZIcjywj4Kz5cVkI4K0al6nj8W7HThm/1V3gqbcpWmZdKML0zFwjndah70LS432vWb87dnToyBzr6MBYIPkAruWolkLKKZVmaP1rKQyj20javyBR5027uyKYSt18eWt6LkbgJjCQThb65B1YiM/4UlU5xGqXvdt4+BnJtzukW1Y8VG72q2Wief9BaGZKodkMr+pJEFRo3lv59Z7H4ttkJ5kg8TEQtABB0g9EwlCv4oH3EZxUh+/m8bljA19k2SfNDrGPkeX4Be2uhQgc0+g2dgIqM7vZPB/Fjn6JR8yIJqpkx96/2gzsPrmXaEpDVly0UgmLpo35+JGrlRR2JglpPfgxb8FD2uJfmMJZp42VTl7dKSusBVLf0fdoUXoOapI+jTdzqsaUWH40xvhIHX941oSgjHOrJYgEfibzOs6W+6ySlnDS0+kdD4A8ZaHFM81cz/pIYoSGR+5RGyWUY1Io0sV1nnBFIO79ezyDx74G7zgKr9PwGnaFFutgxjrQVKtxXLY5PEM8wYykvRJIgDDUEwvbjgYYvBjy8igVp+i+RV8xogbYQVN1xfsvru+Oz02q7+RAeJR62NAXLnccqVpDboaCYTh1jcusAD8cWERW1xhC3NLB4a/ZO0Uc+0ErZjT04oltO9wJdOmDkkuBVetr+eF9AvtgO5z1CXyyW9MDS7XAYogJf6d0GP9v0DhU3sVVQhKHbbOcdocy/BMsFkt85nSwexlksLJTC69zPq36HQOgGvpLwR1VZ0ZCJHPVpQ7IW8ZsGHuK4rMbkiYi8KZtglpfB6hZ2uG+DPjn4S1tG8+3rgdFNAbo4WtHd7r4hA1ElULd0McKCEufzI09CJR6RfugOg6j6ATc4fleOuXeACna6vhz58TXkedW8OCf21igj31kmwMRiffBJmeKBFQ4IpICq/RsPuRAD+d9NJek9idvNBwYK5xSTdjmecIn8B2O8+ZFQuH6XDUUkn0hjITdaTKazoeu+o4GQA0hM/id2walYh/uuZ+r/thGNQXHrFaaji5mVq9Dln5NwttD/X1DnpVQUxAJSo5s0ISRcNnsXRlNWpKwNjLal2mFCNjBp7o+MJu8Wtlwoz1Y1tRAQCm6OsAp8M9kcY+ImAt0JfqWAD5u/Fvlmtt6+5nrRKpn8IhGgRTevwDDKkRayfQRfjuYLraYd7RBGLEKK+OKOHzE63HeqV39YF6JT4GFGJtALxz/XfS8anRyZKydcFzQAy2RZtro2IrNGKeD8V/sMxdqOpE/6wJfeYjM2IZe0Id/FzI1fIRJolH1PfeIfMWInO5BgLAFTlpxIGTUrihoRvgz+7uFXp5M+aL4hVJBkcXe3SVnF9D0sJN4Bf9y4oYJtVJ7PJRB8wcmGvkc4tpPUKAbzZoPirJEhe4rPdS5iSWnkMVcoRogFCVynwokahsKMbo25pgWn2zayv2s8gZy+xGpLEXen8TI5u+bn0cjXqpTrCi2JbmbdShElWrXuYqBrvRc6PSyKXA/x1evpAz7T5pHkdR+DWCyxJk98jClBT0QkEamzMxN9PS+FRfyW4ai2qSxiRJTbktt9aHhiSxP5aJ9ytQP9qBciswy5InJOJgwiibGHfqUTEq+eHoQX9m2B9cdomorDpVHjZkkd628dGsl/Lfc/LSWrmWq6VmR77lhGH/dJwRsqKKtMiga9wR1anKffls4hstoTHejNWyn7hN9XgKs2frrGCpiVM+FGvYj2krO0lpkEReIv6X0Mifz3qgvsuQSnKRPyQm4uf0ifw/c+NFGSmMn3R8PJ5FZwNuunRRk6IvD/fpT4aA3vmuRQTU367LaNcDhkx78DOjEQwr0LQouQvzGYZ5AT9x03Av2wwxuy7eNAmIOyVdCRGF4ZPQWqUullZ68QTcjkalcET2LvS9vJbeQ8FWotKBx8Lh1F75lsn95zxX1Ixe/Uu1EZelrTan+jgXCDeEzgvpCUmMureWXy6lPYOIZUWrBhIGVVJOAsOVO+fjsDbFKXX5wlASglQ2S2VtnEGS1QMiR8Q/cI1CIh24UgGAQ07hoNZeAL9VPFGHiWWOLfYtmV1KFnmIxuF3cRrwyvz2JBvtZofPxDtz1pWbjakeym186jw5U6gTr0WZgWzzO7J7ZxPCQo2TSrlWY+d5qCU5SJ6yN7pDulpCmeppUvnPR7+1koTXsD1vaEHPu1tCuV/4Ny+K6VPbQUMtu2kS8pykz4kA6CGxpMcJKJRJmD4PJ5U3wOL8U7G10JlvgmbryZokBepqEkf8AN0+1MuOomDmsFyTwqgD+jvJIRqlAWlaiB6CJDHG3B4J0/4EsCseOJffU1Hr7Gy5llfaegc7498OETbtsyaRKHm7pbEu963V0M7TiwuxJR9ryfYvdz7rED/W96Ey1dP7wkQ2AYga6zu9yT7oD6nZM/RIE8TxnQNRAN2PjtJke2S+IyW2NKnCmaYUBMbpkWiFD0o92VrVWmEIFwGfwQdWN3SEtTqo8uJcPlHCUtBOr1qrHuCiKllnP1iQs5oKYeMh+6t/VpHuBzt2MtmrF96cKCp6HuBdCyU8UAezl7Xlap59Pi6pojxNiYbFmyxNIkqiIClE+BPziGMe+J+IFYz8PjSRebBbBTdQRzeLo2HZjVnhXkIx0FfDusblyHQ60YZb604vFA8bYnARK6Xa9qFdO53kVlhwSf/eGLa5z97gZdeI7KSBdiUBdD4e8oUwS4H8PQuik+nMeU8zU99BBkP+eAeDW0bvwxiXz1yMs4UBjmpQv21gLgFGRSd2tZJVKokTAyIHgSpvuwiqit53XDqqjMeuvNDgPFLQ54U5JKCdl36PyyIIi3a/5TftmbNlj85AZxTLgZQPrAUnidiZmM3zBv9SJZayIfqECguRJsUvU4qcsCxDYr8HIksNo+OxwfwQ1H1r3V4DghEBHrexv9rNy2tmeaSNzzGAQsp3Hunc4dMU6IpsVjDgSBIXqB637wo9tudhExNwGKoGnHqClnfngpPo1I6oIgtn4AvGm2D4bSyRWQ1vGOHjwcRTXbJ9d5Au7hCoy7QDBh6kOx0KRv8XbZdk7z/3vJSXrA4SkIEcszhMYjFRPWYbp9VGweeAo5mbeGTENdYyz6RHDNgQSnTYzYIEx3MEj7ytRIYlA4PRFP4vkXeVswNEpQhE6ujOj+UCwj6avwBNutaP6mkMXqDOVZQefhUfV/SRr/6RTQQpOexffSEteMp+whPhy8EX8usGsNKgpZKcAea8WKeOnG7i8vLUdf4Nl6JtnSAw+cr36PEsb8m8CFbrFWSEelHs=",
        },
        styles: {
          plot_0: {
            color: "rgba(0,0,0,0)",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_1: {
            color: "#2962ff",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_10: {
            color: "#2962ff",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 4,
            trackPrice: false,
            transparency: 0,
          },
          plot_12: {
            color: "#2962ff",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 5,
            trackPrice: false,
            transparency: 0,
          },
          plot_14: {
            color: "rgba(255,255,255,0.5)",
            display: 15,
            linestyle: 0,
            linewidth: 2,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_15: {
            color: "rgba(255,93,0,0.5)",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 5,
            trackPrice: false,
            transparency: 0,
          },
          plot_16: {
            color: "#00c42b",
            display: 15,
            location: "Absolute",
            plottype: "shape_label_up",
            textColor: "#FFFFFF",
            transparency: 0,
          },
          plot_17: {
            color: "#ff441f",
            display: 0,
            location: "Absolute",
            plottype: "shape_label_down",
            textColor: "#FFFFFF",
            transparency: 0,
          },
          plot_18: {
            color: "#0cb51a",
            display: 15,
            linestyle: 0,
            linewidth: 3,
            plottype: 6,
            trackPrice: false,
            transparency: 0,
          },
          plot_19: {
            color: "#ff1100",
            display: 15,
            linestyle: 0,
            linewidth: 3,
            plottype: 6,
            trackPrice: false,
            transparency: 0,
          },
          plot_20: {
            color: "#0cb51a",
            display: 15,
            linestyle: 0,
            linewidth: 2,
            plottype: 6,
            trackPrice: false,
            transparency: 0,
          },
          plot_21: {
            color: "#ff1100",
            display: 15,
            linestyle: 0,
            linewidth: 2,
            plottype: 6,
            trackPrice: false,
            transparency: 0,
          },
          plot_22: {
            color: "#2962ff",
            display: 15,
            linestyle: 0,
            linewidth: 2,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_24: {
            color: "#0cb51a",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_25: {
            color: "#ff1100",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_26: {
            color: "#2962ff",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_28: {
            color: "#2962ff",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_4: {
            color: "#2962ff",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 5,
            trackPrice: false,
            transparency: 0,
          },
          plot_6: {
            color: "#5b9cf6",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_7: {
            color: "#ffb74d",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_8: {
            color: "#7e57c2",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_9: {
            color: "#ffeb3b",
            display: 15,
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
        },
      },
      description: "Lux Algo Premium Oscillators",
      docs: "",
      filledAreas: [
        {
          fillgaps: false,
          id: "fill_0",
          isHidden: false,
          objAId: "plot_0",
          objBId: "plot_1",
          title: "Stochastic Fill",
          type: "plot_plot",
        },
        {
          fillgaps: false,
          id: "fill_1",
          isHidden: false,
          objAId: "plot_25",
          objBId: "plot_28",
          title: "Overbought Area Fill",
          type: "plot_plot",
        },
        {
          fillgaps: false,
          id: "fill_2",
          isHidden: false,
          objAId: "plot_24",
          objBId: "plot_26",
          title: "Oversold Area Fill",
          type: "plot_plot",
        },
        {
          fillgaps: false,
          id: "fill_3",
          isHidden: false,
          objAId: "hline_1",
          objBId: "hline_2",
          title: "Hlines Background",
          type: "hline_hline",
        },
      ],
      format: { type: "inherit" },
      graphics: {
        dwglabels: { labels: { name: "labels", title: "Labels" } },
        dwglines: { lines: { name: "lines", title: "Lines" } },
      },
      historyCalculationMayChange: true,
      id: "Script$PUB;8bBrCmCGspE390DLRNWYlXrtDxRIoZYe@tv-scripting-101",
      inputs: [
        {
          defval:
            "m6UYKL492UkMlqE3WXH5gA==_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",
          id: "text",
          isHidden: true,
          name: "ILScript",
          type: "text",
        },
        {
          defval: "",
          id: "pineId",
          isHidden: true,
          name: "pineId",
          type: "text",
        },
        {
          defval: "",
          id: "pineVersion",
          isHidden: true,
          name: "pineVersion",
          type: "text",
        },
        {
          defval:
            '{"indicator":1,"plot":1,"str":1,"array":1,"ta":1,"math":1,"alertcondition":1,"line":1,"label":1}',
          id: "pineFeatures",
          isFake: true,
          isHidden: true,
          name: "pineFeatures",
          type: "text",
        },
        {
          defval: "Ultimate Stochastic",
          group: "Basic Settings",
          id: "in_0",
          isFake: true,
          name: "type",
          options: [
            "Ultimate Stochastic",
            "Ultimate MACD",
            "Ultimate RSI",
            "Advanced",
            "Pivot",
          ],
          tooltip: "Determines the type of oscillator to display",
          type: "text",
        },
        {
          defval: 17,
          group: "Basic Settings",
          id: "in_1",
          isFake: true,
          max: 1000000000000,
          min: 5,
          name: "length",
          tooltip:
            "Determines the period of each oscillator, with higher length values aiming to give information about longer-term price variations",
          type: "integer",
        },
        {
          defval: true,
          group: "Basic Settings",
          id: "in_2",
          isFake: true,
          name: "Dynamic Overbought/Oversold Levels",
          tooltip:
            "Determines whether to return dynamic or fixed overbought/oversold levels",
          type: "bool",
        },
        {
          defval: 12,
          group: "Ultimate MACD",
          id: "in_3",
          isFake: true,
          max: 1000000000000,
          min: 1,
          name: "Fast Ultimate MACD",
          type: "integer",
        },
        {
          defval: 26,
          group: "Ultimate MACD",
          id: "in_4",
          isFake: true,
          max: 1000000000000,
          min: 1,
          name: "Slow Ultimate MACD",
          type: "integer",
        },
        {
          defval: 9,
          group: "Ultimate MACD",
          id: "in_5",
          isFake: true,
          max: 1000000000000,
          min: 1,
          name: "Signal Ultimate MACD",
          type: "integer",
        },
      ],
      isRGB: true,
      isTVScript: true,
      isTVScriptStub: false,
      is_hidden_study: false,
      is_price_study: false,
      pine: {
        digest: "a15c9cf95bb3417d6b44b12b5e6eeb89d508d379",
        version: "12.0",
      },
      plots: [
        { id: "plot_0", type: "line" },
        { id: "plot_1", type: "line" },
        { id: "plot_2", target: "plot_1", type: "colorer" },
        { id: "plot_3", target: "fill_0", type: "colorer" },
        { id: "plot_4", type: "line" },
        { id: "plot_5", target: "plot_4", type: "colorer" },
        { id: "plot_6", type: "line" },
        { id: "plot_7", type: "line" },
        { id: "plot_8", type: "line" },
        { id: "plot_9", type: "line" },
        { id: "plot_10", type: "line" },
        { id: "plot_11", target: "plot_10", type: "colorer" },
        { id: "plot_12", type: "line" },
        { id: "plot_13", target: "plot_12", type: "colorer" },
        { id: "plot_14", type: "line" },
        { id: "plot_15", type: "line" },
        { id: "plot_16", type: "shapes" },
        { id: "plot_17", type: "shapes" },
        { id: "plot_18", type: "line" },
        { id: "plot_19", type: "line" },
        { id: "plot_20", type: "line" },
        { id: "plot_21", type: "line" },
        { id: "plot_22", type: "line" },
        { id: "plot_23", target: "plot_22", type: "colorer" },
        { id: "plot_24", type: "line" },
        { id: "plot_25", type: "line" },
        { id: "plot_26", type: "line" },
        { id: "plot_27", target: "plot_26", type: "colorer" },
        { id: "plot_28", type: "line" },
        { id: "plot_29", target: "plot_28", type: "colorer" },
        { id: "plot_30", target: "fill_1", type: "colorer" },
        { id: "plot_31", target: "fill_2", type: "colorer" },
        { id: "plot_32", target: "fill_3", type: "colorer" },
        { id: "plot_33", type: "alertcondition" },
        { id: "plot_34", type: "alertcondition" },
        { id: "plot_35", type: "alertcondition" },
        { id: "plot_36", type: "alertcondition" },
        { id: "plot_37", type: "alertcondition" },
        { id: "plot_38", type: "alertcondition" },
        { id: "plot_39", type: "alertcondition" },
      ],
      scriptIdPart: "PUB;8bBrCmCGspE390DLRNWYlXrtDxRIoZYe",
      shortDescription: "Lux Algo Oscillators Premium [5.0.1]",
      styles: {
        plot_0: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Stochastic Cycle",
        },
        plot_1: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Stochastic Trigger",
        },
        plot_10: {
          histogramBase: 50,
          isHidden: false,
          joinPoints: false,
          title: "Advanced Cycle",
        },
        plot_12: {
          histogramBase: 50,
          isHidden: false,
          joinPoints: false,
          title: "Advanced Main",
        },
        plot_14: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Advanced Outline",
        },
        plot_15: {
          histogramBase: 50,
          isHidden: false,
          joinPoints: false,
          title: "Advanced Institutional Movement",
        },
        plot_16: {
          isHidden: false,
          size: "tiny",
          text: "+",
          title: "Advanced Major Buy",
        },
        plot_17: {
          isHidden: false,
          size: "tiny",
          text: "-",
          title: "Advanced Major Sell",
        },
        plot_18: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Advanced Buy Signal",
        },
        plot_19: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Advanced Sell Signal",
        },
        plot_20: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Advanced Bullish Divergence",
        },
        plot_21: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Advanced Bearish Divergence",
        },
        plot_22: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Pivot Oscillator",
        },
        plot_24: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Dynamic OB Level",
        },
        plot_25: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Dynamic OS Level",
        },
        plot_26: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Dynamic OB Area",
        },
        plot_28: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Dynamic OS Area",
        },
        plot_33: {
          text: "Advanced Major Buy",
          title: "Advanced Oscillator Major Buy",
        },
        plot_34: {
          text: "Advanced Major Sell",
          title: "Advanced Oscillator Major Sell",
        },
        plot_35: {
          text: "Advanced Minor Buy",
          title: "Advanced Oscillator Minor Buy",
        },
        plot_36: {
          text: "Advanced Minor Sell",
          title: "Advanced Oscillator Minor Sell",
        },
        plot_37: {
          text: "Advanced Bullish Divergence",
          title: "Advanced Oscillator Bullish Divergence",
        },
        plot_38: {
          text: "Advanced Bearish Divergence",
          title: "Advanced Oscillator Bearish Divergence",
        },
        plot_39: {
          text: "Alert Fired!",
          title: "Institutional Activity Detected",
        },
        plot_4: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "UMACD Histogram",
        },
        plot_6: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "UMACD",
        },
        plot_7: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "UMACD Signal",
        },
        plot_8: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "URSI",
        },
        plot_9: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "URSI Signal",
        },
      },
      usesPrivateLib: false,
      warnings: [
        "line 354: The division of two `const int` values yields a rounded down `int` value. If you require a `float` result, cast one of the values to `float`: `float(int1) / int2`.",
        "line 355: The division of two `const int` values yields a rounded down `int` value. If you require a `float` result, cast one of the values to `float`: `float(int1) / int2`.",
      ],
    },
  },
};
