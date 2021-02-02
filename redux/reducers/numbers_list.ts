import {
  SET_NUMBERS_LIST,
  SET_NUMBERS_GROUP,
  TOGGLE_NUMBERS_FILTER,
  SET_NUMBERS_DEALERS,
  SET_NUMBERS_TARIFFS,
  SET_NUMBERS_LIST_LENGTH,
  SET_NUMBERS_LIST_PAGE,
  SET_NUMBERS_LIST_BUSY_STATE,
  SET_NUMBERS_STATUSES,
  SET_NUMBERS_SORTING_STATE
} from "../constants";

import type { INumbersState } from "../types/numbers";
import type { NumbersActionTypes } from "../actionTypes";

const initialState: INumbersState = {
  list: [],
  statuses: [],
  tariffs: [],
  dealers: [],
  sort: null,
  group: "",
  filters: [],
  busy: true,
  onPage: 100,
  total: 0,
  page: 1
};

export default function number_list_reducer(state = initialState, action: NumbersActionTypes) {
  switch (action.type) {
    case SET_NUMBERS_LIST:
      return {
        ...state,
        list: action.list
      };
    case SET_NUMBERS_SORTING_STATE:
      return {
        ...state,
        sort: action.sort
      };
    case SET_NUMBERS_DEALERS:
      return {
        ...state,
        dealers: action.dealers
      };
    case TOGGLE_NUMBERS_FILTER:
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
    case SET_NUMBERS_GROUP:
      return {
        ...state,
        group: action.group
      };
    case SET_NUMBERS_TARIFFS:
      return {
        ...state,
        tariffs: action.tariffs
      };
    case SET_NUMBERS_STATUSES: {
      return {
        ...state,
        statuses: action.statuses
      };
    }
    case SET_NUMBERS_LIST_PAGE:
      return {
        ...state,
        page: action.page
      };
    case SET_NUMBERS_LIST_LENGTH:
      return {
        ...state,
        total: action.length
      };
    case SET_NUMBERS_LIST_BUSY_STATE:
      return {
        ...state,
        busy: action.state
      };
    default:
      return state;
  }
}
