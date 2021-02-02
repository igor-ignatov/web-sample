import express, { Request, Response } from "express";
import multer from "multer";

import get_detail from "./functions/customers/get_detail";
import activate_customer from "./functions/customers/activate";
import view_customer from "./functions/customers/view";
import edit_customer from "./functions/customers/edit";

import bill_connect from "./utils/bill_connect";
import save_request from "./utils/save_request";

import type { IDetailItem } from "../common/types/detail";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/activate", upload.any(), (req: Request, res: Response) => {
  activate_customer(req)
    .then((result) => res.send(result))
    .catch((error) => res.send(error));
});

router.post("/edit", upload.any(), (req: Request, res: Response) => {
  edit_customer(req)
    .then((result) => res.send(result))
    .catch((error) => res.send(error));
});

router.post("/toggle_service", (req: Request, res: Response) => {
  const { user } = req.session;
  const { number, service_id, action } = req.body;

  bill_connect({ command: "set_pack", api: "dlr", dlr_id: user.dlr_id, number, pack_id: service_id, act: action })
    .then(async (result) => {
      if (result.code === 0) {
        await save_request(req);
        res.send({ result });
      } else {
        res.send({ error: result });
      }
    })
    .catch((error) => res.send({ error }));
});

router.post("/view/:customer", async (req: Request, res: Response) => {
  const { user } = req.session;
  const { customer } = req.params;
  const numbers_cache = global.numbersCache.get(`numbers_${user.dlr_id}`);

  res.contentType("application/json");

  if (numbers_cache) {
    view_customer(user, numbers_cache, customer)
      .then((result) => {
        res.send({ result });
      })
      .catch((error) => res.send({ error }));
  } else {
    const numbers_response = await bill_connect({ command: "get_numbers", api: "dlr", dlr_id: user.dlr_id }).catch((error) => res.send({ error }));

    if (numbers_response) {
      global.numbersCache.set(`numbers_${user.dlr_id}`, numbers_response.data);

      view_customer(user, numbers_response.data, customer)
        .then((result) => {
          res.send({ result });
        })
        .catch((error) => res.send({ error }));
    }
  }
});

router.post("/detail/:number", (req: Request, res: Response) => {
  const { user } = req.session;
  const { number } = req.params;
  const { period } = req.body;
  const detail_cache: IDetailItem[] = global.detailCache.get(`detail_${number}_${period}`);

  res.contentType("application/json");

  if (detail_cache) {
    res.send({ result: { traffic: detail_cache }});
  } else {
    get_detail(period, number, user)
      .then((prep_detail: IDetailItem[]) => {
        global.detailCache.set(`detail_${number}_${period}`, prep_detail);

        res.send({ result: { traffic: prep_detail }});
      })
      .catch((error) => res.send({ error }));
  }
});

export default router;
