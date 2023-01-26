import { Router, Request, Response } from "express";
import TVClient from "../helpers/tv-client";
import { TvAPIWorker } from "../helpers/tv-worker";

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

// router.post("/data", async (req: Request, res: Response) => {
//   const worker = new TvAPIWorker();
//   await worker.init();
//   await worker.getSymbolData(req.body);
//   res.send("");
// });

router.post("/market-data", async (req: Request, res: Response) => {
  const { numerator, denominator, indicators } = req.body;
  const resp = {} as any;
  if (numerator && denominator) {
    const w1 = new TvAPIWorker();
    await w1.init();
    resp.splits = await w1.getSymbolData({
      symbol: `${numerator}/${denominator}`,
    });
    await w1.disconnect();
    const w2 = new TvAPIWorker();
    await w2.init();
    resp.num = await w2.getSymbolData({
      symbol: numerator,
    });
    await w2.disconnect();

    const w3 = new TvAPIWorker();
    await w3.init();
    resp.denum = await w3.getSymbolData({
      symbol: denominator,
    });
    await w3.disconnect();
    if (indicators?.length) {
      for (const indicator of indicators) {
        const worker = new TvAPIWorker();
        await worker.init();
        const data = await worker.getIndicatorData({
          symbol: `${numerator}/${denominator}`,
          indicator,
        });
        const reversed = (data as any[])?.reverse?.();
        resp.splits = resp.splits
          .reverse()
          .map((v: any, i: number) => ({
            ...v,
            ...reversed[i],
          }))
          .reverse();
        await worker.disconnect();
      }
    }
  }
  res.send(resp);
});

export default router;
