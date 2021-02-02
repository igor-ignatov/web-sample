import { Dispatch } from "redux";

import { batch } from "react-redux";
import * as ActivationsActions from "./actions";

import type { IActivation } from "../../common/types/activations";
import type { ThunkResult } from "../../redux/types";

export const set_activations_list_api = (list: IActivation[]): ThunkResult<void> => (dispatch: Dispatch) => dispatch(ActivationsActions.set_activations_list(list));

export const set_fetching_state_api = (state: boolean): ThunkResult<void> => (dispatch: Dispatch) => dispatch(ActivationsActions.set_fetching_state(state));

export const set_fetching_error_api = (error: boolean): ThunkResult<void> => (dispatch: Dispatch) => dispatch(ActivationsActions.set_fetching_error(error));

export const toggle_activations_filter_api = (filter: { key: string; value: any }): ThunkResult<void> => (dispatch: Dispatch) => dispatch(ActivationsActions.toggle_activations_filter(filter));

export const set_activations_page_api = (page: number): ThunkResult<void> => (dispatch: Dispatch) => dispatch(ActivationsActions.set_activations_page(page));

export function get_activations_api(page: number, sdat: string, edat: string): ThunkResult<Promise<IActivation[]>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      const { filters, onPage } = getState().activations_reducer;

      batch(() => {
        dispatch(set_activations_page_api(page));
        dispatch(set_fetching_state_api(true));
        dispatch(set_fetching_error_api(false));
      });

      dispatch(mtx.fetch("/api_v1/numbers/activations", { body: JSON.stringify({ sdat, edat, filters, page, onPage }) }))
        .then((result: IActivation[]) => {
          batch(() => {
            dispatch(set_activations_list_api(result));
            dispatch(set_fetching_state_api(false));
          });

          resolve(result);
        })
        .catch((error: Error) => {
          batch(() => {
            dispatch(set_fetching_state_api(false));
            dispatch(set_fetching_error_api(true));
          });

          reject(error);
        });
    });
}
