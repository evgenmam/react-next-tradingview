import { Router, Request, Response } from "express";
import { ISTrade } from "../../components/strategy-details/hooks/strategy-trades";
import { IStrategy } from "../../types/app.types";
import {
  ITVScriptParserInput,
  TVScriptParser,
} from "../helpers/tv-script-parser";
import TVApi from "../tradingview";

const scriptsRoutes = Router();

scriptsRoutes.post(
  "/strategy",
  async (req: Request<any, any, ITVScriptParserInput>, res: Response) => {
    const { trades, strategy, dataset, source, upload = false } = req.body;
    const parser = new TVScriptParser(req.body);
    const script = await parser.scriptFromTrades();
    let data;
    if (upload) {
      data = await TVApi.postStrategy(
        script,
        `BG:${strategy?.id}:${dataset} [${source}][${strategy?.direction}]`,
        dataset && strategy?.scripts?.[dataset]
      );
    }
    res.send({ script, data });
  }
);

export default scriptsRoutes;
