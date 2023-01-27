import { Router, Request, Response } from "express";
import { ITVIndicator } from "../../components/tv-components/types";
import { TVChartSession, reconnect, status } from "../helpers/tv-market-data";
import TVApi from "../tradingview";
import indicatorsRoutes from "./indicators";

const router = Router();

router.use("/indicators", indicatorsRoutes);

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
  symbol: string,
  indicators: ITVIndicator[] = []
) => {
  const nSession = new TVChartSession(res);
  await nSession.init();
  let data = await nSession.getSymbol(symbol);
  for (const indicator of indicators) {
    const d: any[] = await nSession.getIndicator(symbol, indicator);
    data = (data as any[]).map((v, i) => ({ ...v, ...d[i] }));
  }
  nSession.cleanup();
  return data;
};

router.post("/market-data", async (req: Request, res: Response) => {
  if (req.body.numerator && req.body.denominator) {
    const s = `${req.body.numerator}/${req.body.denominator}`;
    const [numerator, denominator, split] = await Promise.all([
      getSymbol(res, req.body.numerator),
      getSymbol(res, req.body.denominator),
      getSymbol(res, s, req.body.indicators),
    ]);
    if (!res.headersSent) return res.send({ numerator, denominator, split });
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
