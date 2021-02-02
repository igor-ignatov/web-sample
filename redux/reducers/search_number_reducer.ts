import { SET_SEARCH_STRING, SET_SEARCH_MODE } from "../constants";

import type { ISerachNumberState } from "../types/search_number";
import type { ISerachNumberActionTypes } from "../actionTypes";

const initialState: ISerachNumberState = {
  search_string: "7",
  mode: "pattern"
};

export default function search_number_reducer(state = initialState, action: ISerachNumberActionTypes) {
  switch (action.type) {
    case SET_SEARCH_STRING:
      return {
        ...state,
        search_string: action.str
      };
    case SET_SEARCH_MODE:
      return {
        ...state,
        mode: action.mode
      };
    default:
      return state;
  }
}
