import mongoose from "mongoose";
import historyModel from "../DB/models/history";

import type { Request } from "express";

function save_request(req: Request): Promise<string> {
  return new Promise((resolve, reject) => {
    const number: string = req.body.number || req.query.number;
    const { user } = req.session;

    if (number) {
      historyModel
        .insertMany([{ user, request: { ip: req.headers["x-real-ip"], url: req.originalUrl, ...req.useragent }, data: req.body, number, date: +new Date() }])
        .then(() => {
          resolve("ok");
        })
        .catch((err: mongoose.Error) => console.log("!!! Insert history error: ", err));
    } else {
      console.log("~~~ Empty number: ", req.originalUrl, req.body);
      resolve("ok");
    }
  });
}

export default save_request;
