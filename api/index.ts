import express, { Request, Response } from "express";
import next from "next";
import dotenv from "dotenv";
import router from "./routes/data";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, conf: {} });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
import bodyParser from "body-parser";
import pino from "pino";

dotenv.config();

(async () => {
  try {
    await app.prepare();
    const server = express();

    server.use(bodyParser.json());
    server.use("/api", router);

    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });
    server.listen(port, (err?: any) => {
      if (err) throw err;
      pino({ name: "SYSTEM" }).info(
        `Ready on localhost:${port} - env ${process.env.NODE_ENV}`
      );
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
