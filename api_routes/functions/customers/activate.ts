import FormData from "form-data";
import moment from "moment";

import save_request from "../../utils/save_request";
import bill_connect from "../../utils/bill_connect";
import sse from "../../utils/sse";

import type { ISession } from "../../../common/types/session";
import type { INumber } from "../../../common/types/numbers";
import type { Request } from "express";

interface IDataArg {
  contract_number: string;
  company_name: string;
  inn: string;
  number: string;
}

function activate_customer(req: Request): Promise<{ result: "success"; json: any }> {
  return new Promise((resolve, reject) => {
    const { files, session, body } = req;
    const { contract_number, company_name, inn, number }: IDataArg = body;
    const { user }: ISession = session;

    const Form = new FormData();
    const isTested: boolean = ["79399006445", "79399006446", "79399006447", "79399006448", "79399006449"].includes(number);

    Form.append("command", "act_number");
    Form.append("api", "dlr");
    Form.append("dlr_id", user.dlr_id);
    Form.append("number", number);
    Form.append("company_name", company_name);
    Form.append("inn", inn);
    Form.append("contract_number", contract_number);
    Form.append("contract", files[0].buffer, { contentType: files[0].mimetype, filename: files[0].originalname });

    if (isTested) {
      Form.append("repeat", 1);
    }

    console.log(moment().format("DD.MM.YYYY kk:mm"), " | Try activate contract:  | ", contract_number, " | ", company_name, " | ", inn, " | ", number, " | ", files[0]);

    sse({ type: "god_event", data: { text: `${user.name} активирует номер ${number} для ${company_name}`, icon: "new-layer", timeout: 15000 }});

    if (files[0].size > 3) {
      Form.submit(
        {
          // @ts-ignore
          protocol: process.env.BILL_PROTOCOL,
          host: process.env.BILL_HOST,
          path: "/bill/api-mlt",
          port: process.env.BILL_PORT,
          auth: process.env.API_MLT_AUTH_RAW
        },
        (error, response) => {
          let data: string = "";

          if (error) {
            reject(error);
          }

          response.on("data", (chunk: string) => {
            data += chunk;
          });

          response.once("end", async () => {
            try {
              const json = JSON.parse(data);

              if (json.code === 0) {
                save_request(req).catch((error) => console.log("!!! Save request error: ", error));

                bill_connect({ command: "get_numbers", api: "dlr", dlr_id: user.dlr_id })
                  .then(async (numbers_response: {data: INumber[], result: string}) => {
                    if (numbers_response.result === "success") {
                      if (user.role === "god") {
                        const find_number = numbers_response.data.find(n => n.number === number);

                        if (find_number) {
                          const mtx_numbers_response = await bill_connect({ command: "get_numbers", api: "dlr", dlr_id: find_number.dlr_id }).catch((error) => console.log("!!! Bill response error: ", error));
                          global.numbersCache.set(`numbers_${find_number.dlr_id}`, mtx_numbers_response.data);
                        }
                      } else {
                        const mtx_numbers_response = await bill_connect({ command: "get_numbers", api: "dlr", dlr_id: "0" }).catch((error) => console.log("!!! Bill response error: ", error));
                        global.numbersCache.set("numbers_0", mtx_numbers_response.data);
                      }

                      console.log(">>> Update number cache while update".green);

                      global.numbersCache.set(`numbers_${user.dlr_id}`, numbers_response.data);

                      sse({ type: "numbers_update", data: { date: +new Date() }});
                    }
                  })
                  .catch((error) => console.log("!!! Bill response error: ", error));

                resolve({ result: "success", json });
              } else {
                reject(json);
              }
            } catch (err) {
              reject({ error: err, data });
            }
          });
        }
      );
    } else {
      reject({ error: "Empty file" });
    }
  });
}

export default activate_customer;
