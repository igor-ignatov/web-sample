import express from "express";
import multer from "multer";
import _ from "lodash";

import bill_connect from "./utils/bill_connect";
import prepare_numbers from "./functions/numbers/prepare_numbers";
import search_numbers from "./functions/numbers/search_numbers";
import view_number from "./functions/numbers/view";
import prepare_activations from "./functions/activations/prepare_activations";

import type { INumber, INumberGroup } from "../common/types/numbers";
import type { Request, Response } from "express";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/search", async (req, res) => {
  const { pattern, client } = req.body;
  const { user } = req.session;
  const numbers_cache: INumber[] = global.numbersCache.get(`numbers_${user.dlr_id}`);

  if (pattern) {
    search_numbers(user, "pattern", pattern)
      .then((result) => res.send({ result }))
      .catch((error) => res.send({ error }));
  }

  if (client) {
    search_numbers(user, "client", client, numbers_cache)
      .then(({ raw, grouped }: { raw: INumber[]; grouped: INumberGroup[] }) => {
        global.numbersCache.set(`numbers_${user.dlr_id}`, raw);

        res.send({ result: grouped });
      })
      .catch((error) => res.send({ error }));
  }
});

router.post("/list", (req, res) => {
  const { start, end, options = {}} = req.body;
  const { user } = req.session;

  const numbers_cache: INumber[] = global.numbersCache.get(`numbers_${user.dlr_id}`);

  if (numbers_cache) {
    res.send({ result: prepare_numbers(numbers_cache, start, end, options) });
  } else {
    bill_connect({ command: "get_numbers", api: "dlr", dlr_id: user.dlr_id })
      .then((json) => {
        if (json.result === "success") {
          if (_.isArray(json.data) && !_.isEmpty(json.data[0])) {
            global.numbersCache.set(`numbers_${user.dlr_id}`, json.data);
          }

          res.send({ result: prepare_numbers(json.data, start, end, options) });
        } else {
          res.send({ error: json });
        }
      })
      .catch((error) => {
        console.log("!!! Bill response error: ", error);
        res.send({ error });
      });
  }
});

router.post("/list/download", (req, res) => {
  const { options = {}} = req.body;
  const { user } = req.session;

  const numbers_cache: INumber[] = global.numbersCache.get(`numbers_${user.dlr_id}`);

  if (numbers_cache) {
    res.send({ result: prepare_numbers(numbers_cache, 0, numbers_cache.length, options) });
  } else {
    bill_connect({ command: "get_numbers", api: "dlr", dlr_id: user.dlr_id })
      .then((json) => {
        if (json.result === "success") {
          if (_.isArray(json.data) && !_.isEmpty(json.data[0])) {
            global.numbersCache.set(`numbers_${user.dlr_id}`, json.data);
          }

          res.send({ result: prepare_numbers(json.data, 0, json.data.length, options) });
        } else {
          res.send({ error: json });
        }
      })
      .catch((error) => {
        console.log("!!! Bill response error: ", error);
        res.send({ error });
      });
  }
});

router.post("/parse_contract", upload.any(), (req, res) => {
  // const { files } = req;

  res.send("ok");

  // pdf(files[0].buffer).then((parsed_text) => {
  //   const fname = `static/${uuidv4()}.pdf`;
  //   fs.writeFileSync(fname, files[0].buffer);

  //   pdf_table_extractor(
  //     fname,
  //     (result) => {
  //       try {
  //         fs.unlinkSync(fname);
  //         const numbers_table_start_index = _.findIndex(result.pageTables[1].tables, (t) => t[0] === "Список подключенных номеров") + 2;
  //         const numbers_table_end_index = result.pageTables[1].tables.length - 1;

  //         const numbers_table = result.pageTables[1].tables.slice(numbers_table_start_index, numbers_table_end_index);

  //         const numbers = _.map(numbers_table, (n) => ({ n: n[0], msisdn: n[1], icc: n[2], additional_service: n[3], abon_pay: n[5] }));
  //         const customer_data_arr = result.pageTables[0].tables[2][0].split(/\r?\n/);
  //         const customer = { name: customer_data_arr[2], inn: customer_data_arr[3].slice(0, 10), contract_number: parsed_text.text.split(/\r?\n/)[48].split(" ")[6] };

  //         res.send({ result: { numbers, customer }});
  //       } catch (err) {
  //         res.send({ error: err });
  //       }
  //     },
  //     (error) => {
  //       fs.unlinkSync(fname);

  //       res.send({ error });
  //     }
  //   );
  // });
});

router.post("/activations", (req, res) => {
  const { user } = req.session;
  const { sdat, edat, filters } = req.body;

  bill_connect({ command: "get_activations", api: "dlr", dlr_id: user.dlr_id, sdat, edat, ip: req.headers["x-real-ip"] })
    .then(async (json) => {
      if (json.result === "success") {
        if (_.isEmpty(json.data[0])) {
          res.send({ result: { data: [], l: 0 }});
        } else {
          const prep_activations = await prepare_activations(user, json.data, filters).catch(error => res.send({ error }));

          if (prep_activations) {
            res.send({ result: { data: prep_activations, l: json.data.length }});
          }
        }
      } else {
        res.send({ error: json });
      }
    })
    .catch((error) => res.send({ error }));
});

router.post("/activations_with_users", (req, res) => {
  const { user } = req.session;
  const { sdat, edat, filters } = req.body;

  bill_connect({ command: "get_activations", api: "dlr", dlr_id: user.dlr_id, sdat, edat, ip: req.headers["x-real-ip"] })
    .then(async (json) => {
      if (json.result === "success") {
        if (_.isEmpty(json.data[0])) {
          res.send({ result: { data: [], l: 0 }});
        } else {
          const prep_activations = await prepare_activations(user, json.data, filters, true).catch(error => res.send({ error }));

          if (prep_activations) {
            res.send({ result: { data: prep_activations, l: json.data.length }});
          }
        }
      } else {
        res.send({ error: json });
      }
    })
    .catch((error) => res.send({ error }));
});

router.post("/view/:number", (req: Request, res: Response) => {
  const { user } = req.session;
  const { number } = req.params;
  res.contentType("application/json");

  view_number(user, number)
    .then((result) => res.send({ result }))
    .catch((error) => res.send({ error }));
});

export default router;
