import { SET_SELECTED_NUMBER, GET_NUMBER_INFO_FETCH_STATE } from "../constants";

import type { INumberViewState } from "../types/number";
import type { NumberViewActionTypes } from "../actionTypes";

const initialState: INumberViewState = {
  fetch_info: false,
  selected_number: null
};

export default function number_view_reducer(state = initialState, action: NumberViewActionTypes) {
  switch (action.type) {
    case SET_SELECTED_NUMBER:
      return {
        ...state,
        selected_number: action.number
      };
    case GET_NUMBER_INFO_FETCH_STATE:
      return {
        ...state,
        fetch_info: action.state
      };
    default:
      return state;
  }
}
