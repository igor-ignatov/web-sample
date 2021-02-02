import type { ThunkResult } from "../../redux/types";

export function upload_contract_api(form_data): ThunkResult<Promise<any>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      dispatch(mtx.fetch("/api_v1/numbers/parse_contract", { body: form_data, headers: {}}))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    });
}
