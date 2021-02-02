import { batch } from "react-redux";
import _ from "lodash";

import * as NumbersListActions from "./actions";

import type { Dispatch } from "redux";
import type { INumber, INumbersStatus, IGetNumbersOptions, INumbersResponse } from "../../common/types/numbers";
import type { ThunkResult } from "../../redux/types";

export const set_numbers_list_api = (list: INumber[]): ThunkResult<void> => (dispatch: Dispatch) => dispatch(NumbersListActions.set_number_list(list));

export const set_numbers_busy_state_api = (state: boolean): ThunkResult<void> => (dispatch: Dispatch) => dispatch(NumbersListActions.set_number_list_busy_state(state));

export const set_numbers_list_page_api = (page: number): ThunkResult<void> => (dispatch: Dispatch) => dispatch(NumbersListActions.set_number_list_page(page));

export const set_numbers_list_length_api = (length: number): ThunkResult<void> => (dispatch: Dispatch) => dispatch(NumbersListActions.set_numbers_list_length(length));

export const set_statuses_api = (statuses: INumbersStatus[]): ThunkResult<void> => (dispatch: Dispatch) => dispatch(NumbersListActions.set_statuses(statuses));

export const set_tariffs_api = (tariffs: string[]): ThunkResult<void> => (dispatch: Dispatch) => dispatch(NumbersListActions.set_tariffs(tariffs));

export const set_number_group_api = (group: string): ThunkResult<void> => (dispatch: Dispatch) => dispatch(NumbersListActions.set_number_group(group));

export const set_sorting_state_api = (sort: { key: string, direction: string }): ThunkResult<void> => (dispatch: Dispatch) => dispatch(NumbersListActions.set_sorting_state(sort));

export const set_numbers_dealers_api = (dealers: string[]): ThunkResult<void> => (dispatch: Dispatch) => dispatch(NumbersListActions.set_numbers_dealers(dealers));

export const toggle_numbers_filter_api = (filter: { key: string, value: any }): ThunkResult<void> => (dispatch: Dispatch) => dispatch(NumbersListActions.toggle_numbers_filter(filter));

export function get_numbers_list_api(page: number = 1, options: IGetNumbersOptions = {}): ThunkResult<Promise<INumbersResponse>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      const { onPage, sort, group, filters } = getState().number_list_reducer;
      const start = onPage * page - onPage;
      const end = onPage * page;

      if (!options.sort) {
        if (!options.group) {
          options.sort = sort;
        } else {
          options.sort = null;
          dispatch(set_sorting_state_api(null));
        }
      } else {
        dispatch(set_sorting_state_api(options.sort));
      }

      if (group) {
        options.group = group;
      }

      if (!_.isEmpty(filters)) {
        options.query = filters;
      }

      dispatch(set_numbers_busy_state_api(true));

      dispatch(mtx.fetch("/api_v1/numbers/list", { body: JSON.stringify({ start, end, options }) }))
        .then((result: INumbersResponse) => {
          batch(() => {
            dispatch(set_statuses_api(result.statuses));
            dispatch(set_numbers_list_length_api(result.l));
            dispatch(set_tariffs_api(result.tariffs));
            dispatch(set_numbers_dealers_api(result.dealers));
            dispatch(set_numbers_list_api(result.numbers));

            const count_page = Math.ceil(result.l / onPage);

            if (count_page !== 0 && count_page < page) {
              dispatch(set_numbers_list_page_api(count_page));
            } else {
              dispatch(set_numbers_list_page_api(page));
            }
            dispatch(set_numbers_busy_state_api(false));
          });

          resolve(result);
        })
        .catch((error) => {
          dispatch(set_numbers_busy_state_api(false));

          reject(error);
        });
    });
}
