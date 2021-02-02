import moment, { MomentInput } from "moment";

import { v4 as uuidv4 } from "uuid";
import bill_connect from "../../utils/bill_connect";
import _ from "lodash";

import type { IUser } from "../../../common/types/session";
import type { IDetailItem } from "../../../common/types/detail";

const get_detail = (period: string, number: string, user: IUser): Promise<IDetailItem[]> => {
  return new Promise((resolve, reject) => {
    let sdat: MomentInput, edat: MomentInput;

    switch (period) {
      case "3days":
        sdat = moment().add(-3, "days");
        edat = moment().add(1, "days");
        break;
      case "last_week":
        sdat = moment().startOf("week").add(-1, "week");
        edat = moment().add(-1, "week").add(1, "days");
        break;
      case "week":
        sdat = moment().startOf("week");
        edat = moment().add(1, "days");
        break;
      case "last_month":
        sdat = moment().startOf("month").add(-1, "month");
        edat = moment().add(-1, "month").add(1, "days");
        break;
      case "month":
        sdat = moment().startOf("month");
        edat = moment().add(1, "days");
        break;
      default:
        sdat = moment();
        edat = moment().add(1, "days");
    }

    bill_connect({ command: "get_number_traffic", number, api: "dlr", dlr_id: user.dlr_id, sdat: sdat.format("DD.M.YYYY"), edat: edat.format("DD.M.YYYY") })
      .then(async (result) => {
        if (result.code === 0) {
          const result_traffic = _.isEmpty(result.data.data) ? [] : result.data.data;
          const prep_detail = result_traffic.map((item: any) => {
            const new_item = Object.assign(item, { id: uuidv4() });

            return new_item;
          });

          resolve(prep_detail);
        } else {
          reject(result);
        }
      })
      .catch((error) => reject(error));
  });
};

export default get_detail;
