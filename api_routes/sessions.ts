import express from "express";

import usersModel from "./DB/models/users";
import sse from "./utils/sse";

import type { IUser } from "../common/types/session";
import type { MongooseDocument, Error as MongooseError } from "mongoose";

import type { Request, Response } from "express";

const router = express.Router();

router.post("/create", (req: Request, res: Response) => {
  const { session } = req;
  const { login, pass } = req.body;

  usersModel.findOne({ login, pass }, (error: MongooseError, resp: MongooseDocument) => {
    if (error) {
      res.send({ error });
    } else if (resp) {
      const user: IUser = resp.toObject();

      delete user.pass;

      session.user = user;
      session.verify = true;
      session.ua = req.useragent;

      sse({ type: "god_event", data: { text: `${user.name} вошел в систему`, icon: "user" }});

      res.send({ result: user });
    } else {
      res.send({ error: "Invalid login or password" });
    }
  });
});

router.post("/destroy", (req: Request, res: Response) => {
  const { session } = req;

  session.destroy((error: Error) => {
    if (error) {
      res.send({ error });
    } else {
      res.send({ result: "success" });
    }
  });
});

router.get("/subscribe", (req: Request, res: Response) => {
  const { user } = req.session;

  res.writeHead(200, {
    "Content-Encoding": "none",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no"
  });

  if (user) {
    usersModel.findByIdAndUpdate(user._id, { last_seen: +new Date() }, (err) => {
      if (!err) {
        user.online = true;
        user.ip = req.headers["x-real-ip"];

        req.session.save(() => {
          console.log(">>> User goes online: ".magenta, JSON.stringify(req.session.user));
        });
      }
    });

    const on_event = (event: { type: string; data: string }) => {
      console.log(">>> Got new event: ".cyan, event, user._id);
      const prased_event = typeof event === "string" ? JSON.parse(event) : event;
      const event_data = typeof prased_event.data === "string" ? prased_event.data : JSON.stringify(prased_event.data);

      if (["god_event"].includes(prased_event.type)) {
        if (user.role === "god") {
          res.write(`event: ${prased_event.type}\ndata: ${event_data}\n\n`);
        }
      } else {
        res.write(`event: ${prased_event.type}\ndata: ${event_data}\n\n`);
      }
    };

    global.sessionEmitter.on(`mvno_event_${user._id}`, on_event);

    req.on("close", () => {
      user.online = false;

      req.session.save(() => {
        console.log(">>> User goes offline: ".magenta, JSON.stringify(req.session.user));
      });

      global.sessionEmitter.off(`mvno_event_${user._id}`, on_event);
    });
  } else {
    res.write("\n\n");
  }
});

export default router;
