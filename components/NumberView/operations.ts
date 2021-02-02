import { batch } from "react-redux";
import * as NumberViewActions from "./actions";

import type { INumberInfo } from "../../common/types/numbers";
import type { Dispatch } from "redux";
import type { ThunkResult } from "../../redux/types";

export const set_selected_number_api = (number: INumberInfo): ThunkResult<void> => (dispatch: Dispatch) => dispatch(NumberViewActions.set_selected_number(number));

export const set_fetch_state_api = (state: boolean): ThunkResult<void> => (dispatch: Dispatch) => dispatch(NumberViewActions.set_fetch_state(state));

export function get_number_info_api(number: string): ThunkResult<Promise<INumberInfo>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      const poor_number: string = number.replace(/\D/g, "").slice(1);

      dispatch(set_fetch_state_api(true));

      dispatch(mtx.fetch(`/api_v1/numbers/view/${poor_number}`))
        .then((result: INumberInfo) => {
          batch(() => {
            dispatch(set_selected_number_api(result));
            dispatch(set_fetch_state_api(false));
          });

          resolve(result);
        })
        .catch((error) => {
          dispatch(set_fetch_state_api(false));
          reject(error);
        });
    });
}

export function toggle_service_api(service_id: string, action: string): ThunkResult<Promise<any>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      const { selected_number } = getState().number_view_reducer;

      dispatch(mtx.fetch("/api_v1/customer/toggle_service", { body: JSON.stringify({ number: selected_number.number, service_id, action }) }))
        .then(async (result) => {
          const upd_result = await dispatch(get_number_info_api(selected_number.number)).catch((err) => reject(err));

          if (upd_result) {
            // @ts-ignore
            if (upd_result.error) {
              // @ts-ignore
              reject(upd_result.error);
            } else {
              resolve(result);
            }
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
}

export function edit_customer_api(upd_data: any): ThunkResult<Promise<any>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      const { selected_number } = getState().number_view_reducer;

      dispatch(mtx.fetch("/api_v1/customer/edit", { body: JSON.stringify({ number: selected_number.number, upd_data }) }))
        .then(async (result) => {
          const upd_result = await dispatch(get_number_info_api(selected_number.number)).catch((err) => reject(err));

          // @ts-ignore
          if (upd_result.error) {
            // @ts-ignore
            reject(upd_result.error);
          } else {
            resolve(result);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
}
