import querystring, { ParsedUrlQueryInput } from "querystring";
import fetch, { RequestInit } from "node-fetch";

function bill_connect(data: ParsedUrlQueryInput, api: string = "api-mlt"): Promise<any> {
  return new Promise((resolve, reject) => {
    let auth: string = process.env.API_MLT_AUTH;

    if (api === "api-armo") {
      auth = process.env.API_ARMO_AUTH;
    }

    const queryfied_data = querystring.stringify(data);

    console.log(">>> Bill request: ".bgGreen, queryfied_data);

    const request_options: RequestInit = {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Length": Buffer.byteLength(queryfied_data).toString(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: queryfied_data
    };

    fetch(`${process.env.BILL_PROTOCOL}//${process.env.BILL_HOST}:${process.env.BILL_PORT}/bill/${api}`, request_options)
      .then((resp) => resp.text())
      .then((text) => {
        try {
          const json: object = JSON.parse(text);

          resolve(json);
        } catch (err) {
          resolve(text);
        }
      })
      .catch((error) => reject(error));
  });
}

export default bill_connect;
