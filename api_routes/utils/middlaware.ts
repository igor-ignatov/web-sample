import moment from "moment";
import auth_middleware from "./https_auth";

import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../../common/types/session";

function router_middleware(req: Request, res: Response, next: NextFunction, nextApp): void {
  if (req.originalUrl.includes("_next") || req.originalUrl.includes("/users/rate") || req.originalUrl.includes("/static/")) {
    next();
  } else {
    const { user }: { user: IUser } = req.session;

    console.log(`
    =================
    | Request:  ${req.method} | ${moment().format("DD.MM.YYYY kk:mm")}
    | Path:     ${req.originalUrl}
    | User:     ${req.session.verify ? String(user.login).green + " | " + String(user.name).green + " | " + String(user.role).green : "Not authtorized".bgRed}
    =================
    `);

    if (req.originalUrl.includes("/api_v1/sessions")) {
      next();
    } else if (req.originalUrl.includes("/api_v1/users")) {
      if (user && user.role === "god") {
        next();
      } else {
        res.sendStatus(404);
      }
    } else if (req.session.verify) {
      next();
    } else if (req.method === "GET") {
      if (req.session.verify) {
        next();
      } else {
        nextApp.render(req, res, "/sign_in", req.query);
      }
    } else {
      console.log(">>> Request goes to api_v1: ".bgMagenta, req.originalUrl, req.session.verify);

      if (req.originalUrl.includes("/api_v1/numbers") || req.originalUrl.includes("/api_v1/customer")) {
        auth_middleware(req, res, next);
      } else {
        res.status(401).send({ error: "401 Unauthorized" });
      }
    }
  }
}

export default router_middleware;
