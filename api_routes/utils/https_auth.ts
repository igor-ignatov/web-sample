import usersModel from "../DB/models/users";

import type { Request, Response, NextFunction } from "express";

async function auth_middleware(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization || req.headers.authorization.indexOf("Basic ") === -1) {
    res.set("WWW-Authenticate", "Basic realm=\"401\"");
    return res.status(401).json({ message: "Missing Authorization Header" });
  }

  req.session.session_data = {};
  const base64Credentials = req.headers.authorization.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [login, pass] = credentials.split(":");

  return usersModel.findOne({ login, pass }, (error, user_result) => {
    if (error) {
      res.set("WWW-Authenticate", "Basic realm=\"401\"");
      res.status(401).json({ message: "Invalid Authentication Credentials" });
    } else {
      if (user_result) {
        console.log(">>> Hello: ".america, login.toString().bgBlue, req.path, " ".rainbow);
        const user = user_result.toJSON();

        if (user.role === "api") {
          req.session.user = user;
          req.session.verify = true;

          req.session.save(() => {
            next();
          });
        } else {
          res.set("WWW-Authenticate", "Basic realm=\"401\"");
          res.status(401).json({ message: "You are not allowed" });
        }
      } else {
        res.set("WWW-Authenticate", "Basic realm=\"401\"");
        res.status(401).json({ message: "Invalid Authentication Credentials" });
      }
    }
  });
}

export default auth_middleware;
