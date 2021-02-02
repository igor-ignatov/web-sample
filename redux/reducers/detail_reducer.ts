import { SET_DETAIL_RESULT, SET_DETAIL_ERROR, SET_DETAIL_FETCHING_STATE } from "../constants";

import type { IDetailState } from "../types/detail";
import type { DetailActionTypes } from "../actionTypes";

const initialState: IDetailState = {
  detail: { traffic: [] },
  isFetching: false,
  error: false
};

export default function detail_reducer(state = initialState, action: DetailActionTypes) {
  switch (action.type) {
    case SET_DETAIL_RESULT:
      return {
        ...state,
        detail: action.detail
      };
    case SET_DETAIL_ERROR:
      return {
        ...state,
        error: action.error
      };
    case SET_DETAIL_FETCHING_STATE:
      return {
        ...state,
        isFetching: action.state,
        error: action.state ? false : state.error
      };
    default:
      return state;
  }
}
