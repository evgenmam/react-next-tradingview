import WS from "ws";
import { readMessages } from "../utils";
const URL = "wss://prodata.tradingview.com/socket.io/websocket";
const BUILD_ID = "2023_01_25-11_52";
const CHART_ID = "lfNsKpYG";

const handlers = {
  quote_add_symbols: (data: any) => {},
};

export class TVClientC {
  handlers: Record<string, (data: any) => void> = {};
  ws: WS;

  constructor() {
    this.ws = new WS(
      `${URL}?from=chart%2F${CHART_ID}%2F&date=${BUILD_ID}&type=chart`,
      { headers: { Origin: "https://www.tradingview.com" } }
    );
    this.handle();
  }

  listen = (msg: string, cb: (data: any) => void) => {
    this.handlers[msg] = cb;
  };

  handle = () => {
    this.ws.on("message", this.receive);
  };

  receive = async (data: WS.RawData) => {
    const message = data.toString();
    if (message.startsWith("~m~")) {
      const messages = readMessages(message);
      messages.forEach((v) => {
        if (typeof v === "string" && v.startsWith("~m~")) {
          this.ws.send(message);
        } else {
          // @ts-ignore
          this.handlers[v.m]?.(v.p);
        }
      });
    }
  };

  send = async (
    m: string,
    data: Record<string, any> | Record<string, any>[]
  ) => {
    const message = JSON.stringify({ m, p: data });
    const encoded = `~m~${message.length}~m~${message}`;
    console.log("sending:: ", encoded);
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
}

const TVClient = TVClientC;

export default TVClient;
// ('~m~136~m~{"m":"quote_remove_symbols","p":["qs_3KXgB62dHeyC","={\\"adjustment\\":\\"splits\\",\\"currency-id\\":\\"HKD\\",\\"symbol\\":\\"HKEX_DLY:1810\\"}"]}');
// ('{"m":"quote_add_symbols","p":["qs_3KXgB62dHeyC","={\\"adjustment\\":\\"splits\\",\\"symbol\\":\\"MILSEDEX:I06724\\"}"]}');
// ('{"m":"resolve_symbol","p":["cs_H6E5QMLwckLZ","sds_sym_7","={\\"inputs\\":{},\\"symbol\\":{\\"adjustment\\":\\"splits\\",\\"symbol\\":\\"MILSEDEX:I06724\\"},\\"type\\":\\"BarSetHeikenAshi@tv-basicstudies-60!\\"}"]}');
// ('{"m":"modify_series","p":["cs_H6E5QMLwckLZ","sds_2","s4","sds_sym_7","1W",""]}');
// ('{"m":"quote_add_symbols","p":["qs_snapshoter_basic-symbol-quotes_UAvKnZ5mrFPW","MILSEDEX:I06724"]}');
// ("~h~17");
