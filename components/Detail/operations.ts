import { batch } from "react-redux";
import * as DeatilActions from "./actions";

import type { IDetail } from "../../common/types/detail";
import type { Dispatch } from "redux";
import type { ThunkResult } from "../../redux/types";

export const set_detail_result_api = (result: IDetail[]): ThunkResult<void> => (dispatch: Dispatch) => dispatch(DeatilActions.set_detail_result(result));

export const set_detail_fetching_state_api = (state: boolean): ThunkResult<void> => (dispatch: Dispatch) => dispatch(DeatilActions.set_detail_fetching_state(state));

export const set_detail_error_api = (error: boolean): ThunkResult<void> => (dispatch: Dispatch) => dispatch(DeatilActions.set_detail_error(error));

export function fetch_detail_api(number: string, period: string): ThunkResult<Promise<IDetail[]>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      dispatch(set_detail_fetching_state_api(true));

      dispatch(mtx.fetch(`/api_v1/customer/detail/${number}`, { body: JSON.stringify({ period }) }))
        .then((result: IDetail[]) => {
          batch(() => {
            dispatch(set_detail_fetching_state_api(false));
            dispatch(set_detail_result_api(result));
          });

          resolve(result);
        })
        .catch((error: Error) => {
          batch(() => {
            dispatch(set_detail_fetching_state_api(false));
            dispatch(set_detail_error_api(true));
          });

          reject(error);
        });
    });
}
