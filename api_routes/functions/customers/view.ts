import bill_connect from "../../utils/bill_connect";

import type { INumber, INumberInfo, ICustomer } from "../../../common/types/numbers";
import type { IUser } from "../../../common/types/session";

export default function view_customer(user: IUser, numbers: INumber[], customer_name: string): Promise<{ numbers: INumber[], client: ICustomer }> {
  return new Promise((resolve, reject) => {
    const filtered = numbers.filter((num) => num.client === customer_name);

    if (filtered.length > 0) {
      bill_connect({ command: "get_number_info", api: "dlr", dlr_id: user.dlr_id, number: filtered[0].number })
        .then((resp: { data: INumberInfo }) => {
          resolve({ numbers: filtered, client: resp.data.customer });
        })
        .catch((error) => reject(error));
    } else {
      resolve({ numbers: filtered, client: null });
    }
  });
}
