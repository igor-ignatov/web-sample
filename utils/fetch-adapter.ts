import fetch from "node-fetch";
import Router from "next/router";

import { set_sign_in_state_api } from "../components/SignInForm/operations";

function fetch_adapter(url: string, options = {}) {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      const { user_data } = getState().global_site_reducer;

      fetch(url, { method: "post", headers: { "Content-Type": "application/json" }, ...options })
        .then(async (resp) => {
          if (resp.status === 200) {
            const json = await resp.json();

            return json;
          }
          if (resp.status === 401) {
            dispatch(set_sign_in_state_api(false));
            Router.reload();

            throw new Error(`User is unauthtorized: ${resp.status}`);
          }

          throw new Error(`Server response with wrong status: ${resp.status}`);
        })
        .then((json) => {
          if (json.result) {
            resolve(json.result);
          } else {
            reject(json);
          }
        })
        .catch((err) => reject(err));
    });
}

export default fetch_adapter;
