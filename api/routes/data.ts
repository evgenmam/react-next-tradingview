import { Router, Request, Response } from "express";
import dynamic from "next/dynamic";
import { ITVIndicator } from "../../components/tv-components/types";
import { TVChartSession, reconnect, status } from "../helpers/tv-market-data";
import TVApi from "../tradingview";
import { mergeDataAndStudies } from "../utils";
import indicatorsRoutes from "./indicators";
import scriptsRoutes from "./scripts";

const router = Router();

router.use("/indicators", indicatorsRoutes);
router.use("/scripts", scriptsRoutes);

router.get("/", (req: Request, res: Response) => {
  res.send("pong");
});

router.get("/search", async (req: Request, res: Response) => {
  const { text, exchange, type } = req.query as Record<string, string>;
  const results = await TVApi.search({ text, exchange, type });
  res.send(results);
});

const getSymbol = async (
  res: Response,
  {
    symbol,
    period = "1W",
    count = 300,
    indicators = [],
    chartType = "candlestick",
  }: {
    symbol: string;
    period?: string;
    count?: number;
    indicators?: ITVIndicator[];
    chartType?: "candlestick" | "heikin-ashi";
  }
) => {
  const nSession = new TVChartSession(res);
  await nSession.init();
  let data = await nSession.getSymbol(symbol, period, +count, chartType);
  const studies = [];
  for (const indicator of indicators) {
    // const d: any[] = await nSession.getIndicator(symbol, indicator);
    // data = (data as any[]).map((v, i) => ({ ...v, ...d[i] }));
    studies.push(await nSession.getIndicator(symbol, indicator));
  }
  nSession.cleanup();
  //@ts-ignore
  return [mergeDataAndStudies(data, studies), studies];
};

router.post("/market-data", async (req: Request, res: Response) => {
  if (req.body.numerator && req.body.denominator) {
    const s = `${req.body.numerator}/${req.body.denominator}`;
    const { numerator: n, denominator: d, indicators: i, ...b } = req.body;
    const [[numerator], [denominator], [split, studies]] = await Promise.all([
      getSymbol(res, { symbol: n, ...b }),
      getSymbol(res, { symbol: d, ...b }),
      getSymbol(res, { symbol: s, ...b, indicators: i }),
    ]);
    if (!res.headersSent)
      return res.send({ numerator, denominator, split, studies });
  }
  if (!res.headersSent) res.send({});
});

router.get("/reconnect", (req, res: Response) => {
  reconnect();
  res.send("ok");
});

router.get("/status", (req, res: Response) => {
  res.send({ status: status() });
});

export default router;
