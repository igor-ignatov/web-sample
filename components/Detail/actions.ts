import { SET_DETAIL_FETCHING_STATE, SET_DETAIL_RESULT, SET_DETAIL_ERROR } from "../../redux/constants";

import type { IDetail } from "../../common/types/detail";

export const set_detail_result = (detail: IDetail[]) => ({
  type: SET_DETAIL_RESULT,
  detail
});

export const set_detail_fetching_state = (state: boolean) => ({
  type: SET_DETAIL_FETCHING_STATE,
  state
});

export const set_detail_error = (error: boolean) => ({
  type: SET_DETAIL_ERROR,
  error
});
