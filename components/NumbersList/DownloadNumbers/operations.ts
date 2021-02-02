import _ from "lodash";

import type { INumber, INumbersStatus, IGetNumbersOptions } from "../../../common/types/numbers";
import type { ThunkResult } from "../../../redux/types";

export interface IApiResponse {
  l: number;
  tariffs: string[];
  statuses: INumbersStatus[];
  dealers: string[];
  numbers: INumber[];
}

export function get_numbers_list_api(page: number = 1, options: IGetNumbersOptions = {}): ThunkResult<Promise<IApiResponse>> {
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
        }
      }

      if (group) {
        options.group = group;
      }

      if (!_.isEmpty(filters)) {
        options.query = filters;
      }

      dispatch(mtx.fetch("/api_v1/numbers/list/download", { body: JSON.stringify({ start, end, options }) }))
        .then((result: IApiResponse) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
}
