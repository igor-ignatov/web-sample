import type { ThunkResult } from "../../redux/types";

export function fetch_client_info_api(customer: string): ThunkResult<Promise<any>> {
  return (dispatch, getState, { mtx }) => {
    return new Promise((resolve, reject) => {
      dispatch(mtx.fetch(`/api_v1/customer/view/${encodeURIComponent(customer)}`))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
