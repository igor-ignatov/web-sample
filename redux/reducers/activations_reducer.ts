import { SET_FETCH_ACTIVATIONS_STATE, SET_ACTIVATIONS_PAGE, SET_FETCH_ACTIVATIONS_ERROR, TOGGLE_ACTIVATIONS_FILTER, SET_FETCH_ACTIVATIONS_RESULT } from "../constants";

import type { ActivationsActionTypes } from "../actionTypes";
import type { IActivationsState } from "../types/activations";

const initialState: IActivationsState = {
  activations: { data: [], l: 0 },
  filters: [],
  isFetching: true,
  error: false,
  page: 1,
  onPage: 100
};

export default function activations_reducer(state = initialState, action: ActivationsActionTypes) {
  switch (action.type) {
    case SET_FETCH_ACTIVATIONS_RESULT:
      return {
        ...state,
        activations: action.list
      };
    case TOGGLE_ACTIVATIONS_FILTER:
      return {
        ...state,
        filters:
            state.filters.findIndex((v) => v.key === action.filter.key) === -1
              ? [...state.filters, action.filter]
              : state.filters.map((f) => {
                if (f.key === action.filter.key) {
                  return action.filter;
                }

                return f;
              })
      };
    case SET_FETCH_ACTIVATIONS_STATE:
      return {
        ...state,
        isFetching: action.state
      };
    case SET_ACTIVATIONS_PAGE:
      return {
        ...state,
        page: action.page
      };
    case SET_FETCH_ACTIVATIONS_ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
