import EventEmitter from "events";
import pino from "pino";
import WS from "ws";
import TVApi from "../tradingview";
import { StudyData, TimescaleUpdate, TSOHLC, TVWSEvent } from "../types";
import {
  duFixTimestamp,
  isPing,
  readMessages,
  timescaleToOHLC,
} from "../utils";
const URL = "wss://prodata.tradingview.com/socket.io/websocket";
const BUILD_ID = "2023_02_15-11_27";
const CHART_ID = "2FxpEbEyXG";
import * as R from "ramda";

const handlers = {
  quote_add_symbols: (data: any) => {},
};

export class TVClientC {
  handlers: Record<string, (data: any) => void> = {};
  ws: WS;
  listener: EventEmitter;
  loggedIn: boolean = false;

  constructor() {
    this.ws = new WS(
      `${URL}?from=chart%2F${CHART_ID}%2F&date=${BUILD_ID}&type=chart`,
      { headers: { Origin: "https://www.tradingview.com" } }
    );
    this.handle();
    this.listener = new EventEmitter();
  }

  login = async () => {
    const results = await TVApi.login();
    if (!results?.user?.auth_token) throw new Error("NO_AUTH_TOKEN");
    await this.init(results.user.auth_token);
    this.loggedIn = true;
  };

  listen = (msg: string, cb: (data: any) => void) => {
    this.handlers[msg] = cb;
  };

  clearListeners = (prefix: string) => {
    this.listener.eventNames().forEach((v) => {
      if (v.toString().startsWith(prefix)) this.listener.removeAllListeners(v);
    });
  };

  handle = () => {
    this.ws.on("message", this.receive);
    this.ws.on("error", (_: WS, error: Buffer) => {
      pino({ name: "TVClientC" }).error({
        error: error.toString(),
        msg: "WS_ERROR",
      });
    });
    this.ws.on("close", (_: WS, code: number, reason: Buffer) => {
      pino({ name: "TVClientC" }).error({ code, reason, msg: "WS_CLOSE" });
    });
  };

  sessionEvent = (e: TVWSEvent) => {
    pino({ name: "SESSION_EVENT" }).warn({ msg: e.m });

    const [ses, ...body] = e.p;
    if (e.m.includes("_error")) {
      const ms = { msg: e.m, body };
      pino({ name: "SESSION_ERROR" }).error(ms);
      this.listener.emit(`${ses}:error`, ms);
      return;
    }
    if (e.m === "series_completed") {
      const [sym] = body;
      this.listener.emit(`${ses}:${sym}:${e.m}`);
    } else if (e.m === "study_completed") {
      const [sym] = body;
      this.listener.emit(`${ses}:${sym}:${e.m}`);
    } else if (e.m === "symbol_resolved") {
      const [sym, r, t, t_ms] = body;
      this.listener.emit(`${ses}:${sym}:${e.m}`, r);
    } else if (e.m === "timescale_update") {
      const [b] = body;
      Object.entries(b).forEach(([sym, v]) => {
        this.listener.emit(
          `${ses}:${sym}:${e.m}`,
          timescaleToOHLC(v as TimescaleUpdate)
        );
        this.listener.emit(`${ses}:${e.m}`, v);
      });
    } else if (e.m === "du") {
      const [d] = body;
      Object.entries(d).forEach(([sym, v]) => {
        if (R.has("st", v))
          this.listener.emit(
            `${ses}:${sym}:${e.m}`,
            duFixTimestamp(v as StudyData)
          );
      });
    } else {
      this.listener.emit(`${ses}:${e.m}`, e.p);
    }
  };

  receive = async (data: WS.RawData) => {
    const message = data.toString();
    if (isPing(message)) {
      return this.ws.send(message);
    } else if (message.startsWith("~m~")) {
      const messages = readMessages(message);
      messages.forEach((v) => {
        if (typeof v === "object" && v.m) {
          this.handlers[v.m]?.(v.p);
          if (v?.p?.[0]?.startsWith?.("cs_")) {
            this.sessionEvent(v);
          }
        }
      });
    }
  };

  waitFor = (...args: string[]) =>
    new Promise((resolve) => {
      const cb = (v: any) => {
        this.listener.removeListener(args.join(":"), cb);
        resolve(v);
      };
      this.listener.once(args.join(":"), cb);
    });

  subscribe = (func: (...d: any[]) => void, ...args: string[]) => {
    this.listener.on(args.join(":"), func);

    return () => this.listener.removeListener(args.join(":"), func);
  };
  onError = (prefix: string) =>
    new Promise(async (resolve) => {
      const cb = (v: any) => {
        this.listener.removeListener(`${prefix}:error`, cb);
        resolve(v);
      };
      this.listener.once(`${prefix}:error`, cb);
      return () => this.listener.removeListener(`${prefix}:error`, cb);
    });
  send = async (
    m: string,
    data: Record<string, any> | Record<string, any>[]
  ) => {
    const ms = { m, p: data };
    const message = JSON.stringify(ms);
    const encoded = `~m~${message.length}~m~${message}`;
    pino({ name: "TVClient" }).info({ sending: m });
    this.ws.send(encoded);
  };

  init = (user_token: string) =>
    new Promise<void>(async (resolve, reject) => {
      if (this.ws.readyState === WS.OPEN) {
        this.send("set_auth_token", [user_token]);
        resolve();
      }
    });

  disconnect = () =>
    new Promise<void>((resolve) => {
      this.ws.on("close", () => {
        resolve();
      });
      this.ws.close();
    });

  reconnect = async () => {
    this.listener.removeAllListeners();
    this.ws.terminate();
    this.ws = new WS(
      `${URL}?from=chart%2F${CHART_ID}%2F&date=${BUILD_ID}&type=chart`,
      { headers: { Origin: "https://www.tradingview.com" } }
    );
    this.handle();
    await this.login();
    this.listener = new EventEmitter();
  };
}

const TVClient = TVClientC;

export default TVClient;
