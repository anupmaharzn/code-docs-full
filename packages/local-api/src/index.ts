import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { createCellsRouter } from "./routes/cells";

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  //routes
  app.use(createCellsRouter(filename, dir));

  //serving react app
  if (useProxy) {
    /**
     * for development
     */
    app.use(
      createProxyMiddleware({
        target: "http://localhost:3000",
        ws: true, //websocket
        logLevel: "silent",
      })
    );
  } else {
    /**
     *for production
     */
    //gonna find absolute path up to index.html behind the scenes
    const packagePath = require.resolve(
      "@js-docs-anup/client/build/index.html"
    );
    //we need up to /build so path.dirname
    app.use(express.static(path.dirname(packagePath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on("error", reject);
  });
};
