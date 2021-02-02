import { SET_USERS_LIST, SET_USERS_FETCHING_STATE, SET_USERS_FETCHING_ERROR_STATE, SET_DEALERS_LIST } from "../constants";

import type { IUsersState } from "../types/users";
import type{ IUsersActionTypes } from "../actionTypes";

const initialState: IUsersState = {
  users: [],
  dealers: [],
  isFetching: false,
  error: false
};

export default function users_reducer(state = initialState, action: IUsersActionTypes) {
  switch (action.type) {
    case SET_USERS_LIST:
      return {
        ...state,
        users: action.users
      };
    case SET_DEALERS_LIST:
      return {
        ...state,
        dealers: action.dealers
      };
    case SET_USERS_FETCHING_STATE:
      return {
        ...state,
        isFetching: action.state
      };
    case SET_USERS_FETCHING_ERROR_STATE:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
