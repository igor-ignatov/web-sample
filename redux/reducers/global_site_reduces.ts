import { SET_LOGIN_STATE, SET_APP_READY_STATE, SET_USER_DATA, TOGGLE_THEME } from "../constants";

import type { IGlobalSiteReducer } from "../types/global";

const initialState: IGlobalSiteReducer = {
  user_data: null,
  app_ready: false,
  isLogin: false,
  theme: "bp3-dark"
};

export default function global_site_reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN_STATE:
      return {
        ...state,
        isLogin: action.state
      };
    case SET_APP_READY_STATE:
      return {
        ...state,
        app_ready: action.state
      };
    case TOGGLE_THEME:
      return {
        ...state,
        theme: action.theme
      };
    case SET_USER_DATA:
      return {
        ...state,
        user_data: action.data
      };
    default:
      return state;
  }
}
