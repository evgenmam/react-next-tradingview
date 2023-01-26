import EventEmitter from "events";
import pino from "pino";
import WS from "ws";
import TVApi from "../tradingview";
import { TimescaleUpdate, TSOHLC, TVWSEvent } from "../types";
import { readMessages, timescaleToOHLC } from "../utils";
const URL = "wss://prodata.tradingview.com/socket.io/websocket";
const BUILD_ID = "2023_01_26-12_41";
const CHART_ID = "lfNsKpYG";

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
    // const chartprops = JSON.parse(results?.user?.settings?.chartproperties);
    await this.init(results.user.auth_token);
    this.loggedIn = true;
  };

  listen = (msg: string, cb: (data: any) => void) => {
    this.handlers[msg] = cb;
  };

  handle = () => {
    this.ws.on("message", this.receive);
  };

  sessionEvent = (e: TVWSEvent) => {
    pino({ name: "SESSION_EVENT" }).warn({ msg: e.m });
    const [ses, ...body] = e.p;
    switch (e.m) {
      case "symbol_resolved":
        const [sym, r, t, t_ms] = body;
        this.listener.emit(`${ses}:${sym}:${e.m}`, r);
      case "timescale_update":
        const [b] = body;
        Object.entries(b).forEach(([sym, v]) => {
          this.listener.emit(
            `${ses}:${sym}:${e.m}`,
            timescaleToOHLC(v as TimescaleUpdate)
          );
        });
      case "du":
        const [d] = body;
        Object.entries(d).forEach(([sym, v]) => {
          this.listener.emit(`${ses}:${sym}:${e.m}`, v);
        });
      default:
        this.listener.emit(`${ses}:${e.m}`, e.p);
    }
  };

  receive = async (data: WS.RawData) => {
    const message = data.toString();
    if (message.startsWith("~m~")) {
      const messages = readMessages(message);
      messages.forEach((v) => {
        if (typeof v === "string" && v.startsWith("~m~")) {
          this.ws.send(message);
        } else if (typeof v === "object" && v.m) {
          if (v.m.indexOf("error") > -1) {
            pino({ name: "TVClient" }).error({ error: v.p, message: v.m });
          }
          this.handlers[v.m]?.(v.p);
          if (v?.p?.[0]?.startsWith?.("cs_")) {
            this.sessionEvent(v);
          }
        }
      });
    }
  };

  waitFor = (...args: string[]) =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        this.listener.removeAllListeners();
        reject();
      }, 7500);
      const cb = (v: any) => {
        this.listener.removeListener(args.join(":"), cb);
        clearTimeout(t);
        resolve(v);
      };
      this.listener.once(args.join(":"), cb);
    });

  send = async (
    m: string,
    data: Record<string, any> | Record<string, any>[]
  ) => {
    const ms = { m, p: data };
    const message = JSON.stringify(ms);
    const encoded = `~m~${message.length}~m~${message}`;
    pino({ name: "TVClient" }).info({ sending: ms });
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
