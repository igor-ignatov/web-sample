import _ from "lodash";

import bill_connect from "../../utils/bill_connect";
import group_numbers from "./group_numbers";

import type { IUser } from "../../../common/types/session";
import type { INumber } from "../../../common/types/numbers";

function search_numbers(user: IUser, type: "pattern" | "client", query: string, numbers_cache?: INumber[]) {
  return new Promise(async (resolve, reject) => {
    // Поиск по паттерну
    if (type === "pattern") {
      bill_connect({ command: "get_numbers", api: "dlr", dlr_id: user.dlr_id, pattern: query })
        .then((json) => {
          if (json.result === "success") {
            resolve(_.isEmpty(json.data[0]) ? [] : json.data);
          } else {
            reject(json);
          }
        })
        .catch((error) => reject(error));
    }

    // Поиск по клиенту
    if (type === "client") {
      let numbers = numbers_cache;

      if (_.isEmpty(numbers_cache)) {
        const numbers_resp = await bill_connect({ command: "get_numbers", api: "dlr", dlr_id: user.dlr_id }).catch((error) => reject(error));

        if (numbers_resp.result === "success") {
          numbers = numbers_resp.data;
        } else {
          reject(numbers_resp);
        }
      }

      const filtered = _.filter(numbers, (f) => f.client.toLowerCase().trim().includes(query.toLowerCase().trim()));
      const grouped = group_numbers(filtered, "client");

      resolve({ grouped, raw: numbers });
    }
  });
}

export default search_numbers;
