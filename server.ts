import express, { Application } from "express";
import nextJS from "next";
import colors from "colors";
import { EventEmitter } from "events";
import bodyParser from "body-parser";
import { parse } from "url";
import useragent from "express-useragent";
import mongoose from "mongoose";
import NodeCache from "node-cache";
import session from "express-session";
import cors from "cors";

import router_middleware from "./api_routes/utils/middlaware";
import sessions_route from "./api_routes/sessions";
import numbers_route from "./api_routes/numbers";
import customers_route from "./api_routes/customer";
import users_route from "./api_routes/users";
import dealers_route from "./api_routes/dealers";

colors.enable();
require("dotenv").config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = nextJS({ dev });
const nextHandle = nextApp.getRequestHandler();
const MemoryStore = require("memorystore")(session);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.setMaxListeners(0);

nextApp.prepare().then(() => {
  const server: Application = express();
  server.use(bodyParser.json({ limit: "50mb" }));
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.text());
  server.use(useragent.express());
  server.set("trust proxy", true);

  const corsOptions = {
    origin: dev ? "*" : process.env.ROOT_HOST,
    optionsSuccessStatus: 200
  };

  server.use(cors(corsOptions));

  const store: session.MemoryStore = new MemoryStore({ checkPeriod: 60 * 60 * 60 * 24 });

  global.mvno_sessions_store = store;

  server.use(
    session({
      store,
      secret: process.env.COOKIE_SECRET,
      resave: false,
      rolling: true,
      saveUninitialized: true,
      cookie: { secure: false, maxAge: 60 * 60 * 60 * 24 }
    })
  );

  server.use("/api_v1/sessions", (req, res, next) => router_middleware(req, res, next, nextApp), sessions_route);
  server.use("/api_v1/numbers", (req, res, next) => router_middleware(req, res, next, nextApp), numbers_route);
  server.use("/api_v1/customer", (req, res, next) => router_middleware(req, res, next, nextApp), customers_route);
  server.use("/api_v1/users", (req, res, next) => router_middleware(req, res, next, nextApp), users_route);
  server.use("/api_v1/dealers", (req, res, next) => router_middleware(req, res, next, nextApp), dealers_route);

  server.get(
    "*",
    (req, res, next) => router_middleware(req, res, next, nextApp),
    async (req, res) => {
      const parsedUrl = parse(req.url, true);

      nextHandle(req, res, parsedUrl);
    }
  );

  server.listen(port, () => {
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, poolSize: 100 });

    mongoose.connection.once("open", async () => {
      console.log(`> Mongo connected | URL: ${process.env.MONGO_URL}`);
    });

    mongoose.connection.once("error", (error) => {
      console.log("!!! Mongo connecting error:", error);

      throw error;
    });

    global.detailCache = new NodeCache({ checkperiod: 60, stdTTL: 60 * 60 });
    global.numbersCache = new NodeCache({ checkperiod: 60, stdTTL: 60 * 60 * 12 });

    const sessionEmitter = new EventEmitter();

    global.sessionEmitter = sessionEmitter;

    console.log(`> Ready on http://localhost:${port} | ENV: ${process.env.NODE_ENV}`);
  });

  server.on("error", (e) => console.log(e));
});
