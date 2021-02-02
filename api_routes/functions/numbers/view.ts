import moment from "moment";

import bill_connect from "../../utils/bill_connect";

import historyModel from "../../DB/models/history";

import type { IUser } from "../../../common/types/session";
import type { INumberInfo, INumberActionsLog } from "../../../common/types/numbers";
import type { MongooseDocument, Error as MongooseError } from "mongoose";

function view_number(user: IUser, number: string): Promise<INumberInfo> {
  return new Promise((resolve, reject) => {
    bill_connect({ command: "get_number_info", api: "dlr", dlr_id: user.dlr_id, number })
      .then(async (bill_response: { data: INumberInfo }) => {
        bill_response.data.matrix_packs = bill_response.data.matrix_packs.filter((p) => {
          if (p.name.includes("FMC UISCOM")) {
            if (p.name === "FMC UISCOM") {
              return Object.assign(p, { avaliable: false });
            }
            return Object.assign(p, { avaliable: true });
          }
        });

        historyModel.find({ $or: [{ number }, { number: `7${number}` }] }, (err: MongooseError, history: MongooseDocument[]) => {
          if (err) {
            console.log("!!! Find history error: ", err);

            resolve(Object.assign(bill_response.data, { request_history: [] }));
          } else {
            const prep_history: INumberActionsLog[] = history.map((h) => {
              const ho = h.toObject();
              const new_h = Object.assign(ho, { date: moment(ho.date).format("DD.MM.YYYY kk:hh:ss") });

              return new_h;
            });

            resolve(Object.assign(bill_response.data, { request_history: prep_history.reverse() }));
          }
        });
      })
      .catch((error) => reject(error));
  });
}

export default view_number;
