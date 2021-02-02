import express from "express";

import dealersModel from "./DB/models/dealers";

import type { IDealer } from "../common/types/dealers";
import type { MongooseDocument, Error as MongooseError } from "mongoose";

const router = express.Router();

router.post("/list", (req, res) => {
  dealersModel.find((error: MongooseError, result: MongooseDocument[]) => {
    if (error) {
      res.send({ error });
    } else {
      const dealers: IDealer[] = result.map(r => r.toObject());

      res.send({ result: dealers });
    }
  });
});

export default router;
