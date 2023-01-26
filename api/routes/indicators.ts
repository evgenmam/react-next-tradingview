import { Router, Request, Response } from "express";

import TVApi from "../tradingview";

const indicatorsRoutes = Router();

indicatorsRoutes.get("/search", async (req: Request, res: Response) => {
  const { search } = req.query as Record<string, string>;
  res.send(await TVApi.searchIndicators(search));
});

indicatorsRoutes.post("/translate", async (req: Request, res: Response) => {
  const { id } = req.query as Record<string, string>;
  res.send(await TVApi.translateIndicator(req.body));
});

export default indicatorsRoutes;
