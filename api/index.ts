import express, { Request, Response } from "express";
import next from "next";
import dotenv from "dotenv";
import router from "./routes/data";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
import bodyParser from "body-parser";

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
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
