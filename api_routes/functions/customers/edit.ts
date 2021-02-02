import save_request from "../../utils/save_request";
import bill_connect from "../../utils/bill_connect";
import sse from "../../utils/sse";

import type { ISession } from "../../../common/types/session";
import type { Request } from "express";

function edit_customer(req: Request): Promise<any> {
  return new Promise((resolve, reject) => {
    const { session, body } = req;
    const { upd_data, number } = body;
    const { user }: ISession = session;

    bill_connect({ command: "act_number", repeat: 1, api: "dlr", dlr_id: user.dlr_id, number, ...upd_data })
      .then((upd_response) => {
        if (upd_response.result === "success") {
          console.log(">>> Update customer: ".green);

          save_request(req).catch((error) => console.log("!!! Save request error: ", error));
          sse({ type: "god_event", data: { text: `${user.name} отредактировал данные для ${upd_data.company_name} (${number})`, icon: "edit", timeout: 10000 }});

          resolve({ result: "success", upd_response });
        } else {
          reject(upd_response);
        }
      })
      .catch((error) => reject(error));
  });
}

export default edit_customer;
