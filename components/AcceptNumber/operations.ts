import { get_number_info_api } from "../NumberView/operations";

import type { ThunkResult } from "../../redux/types";

export function activate_number_api(form_data: FormData): ThunkResult<Promise<any>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      dispatch(mtx.fetch(`/api_v1/customer/activate?number=${form_data.get("number")}`, { body: form_data, headers: {}}))
        .then(async (result) => {
          const number: string = form_data.get("number").toString();
          const upd_result = await dispatch(get_number_info_api(number)).catch((err) => reject(err));

          // @ts-ignore
          if (upd_result.error) {
            // @ts-ignore
            reject(upd_result.error);
          } else {
            resolve(result);
          }
        })
        .catch((error) => reject(error));
    });
}
