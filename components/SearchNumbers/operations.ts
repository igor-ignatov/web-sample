import { batch } from "react-redux";
import _ from "lodash";

import * as SearchActions from "./actions";
import { set_numbers_list_api, set_numbers_list_length_api, set_number_group_api } from "../NumbersList/operations";

import type { ThunkResult } from "../../redux/types";
import type { INumber } from "../../common/types/numbers";

export const set_search_string_api = (str: string): ThunkResult<void> => (dispatch) => dispatch(SearchActions.set_search_string(str));

export const set_search_mode_api = (mode: string): ThunkResult<void> => (dispatch) => dispatch(SearchActions.set_search_mode(mode));

export function search_number_api(pattern: string): ThunkResult<Promise<INumber[]>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      const pattern_arr: Array<string> = pattern.replace(/\D/g, "").split("");

      for (let i = pattern_arr.length; i < 11; i++) {
        pattern_arr.push("?");
      }

      const pure_pattern: string = pattern_arr.join("");

      dispatch(mtx.fetch("/api_v1/numbers/search", { body: JSON.stringify({ pattern: pure_pattern }) }))
        .then((result: INumber[]) => {
          batch(() => {
            dispatch(set_number_group_api(""));
            dispatch(set_numbers_list_length_api(result.length));
            dispatch(set_numbers_list_api(result));
          });

          resolve(result);
        })
        .catch((error) => reject(error));
    });
}

export function search_number_by_string_api(str: string): ThunkResult<Promise<INumber[]>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      dispatch(mtx.fetch("/api_v1/numbers/search", { body: JSON.stringify({ client: str }) }))
        .then((result: INumber[]) => {
          batch(() => {
            dispatch(set_number_group_api("client"));
            dispatch(set_numbers_list_length_api(_.flatten(result).length));
            dispatch(set_numbers_list_api(result));
          });

          resolve(result);
        })
        .catch((error) => reject(error));
    });
}
