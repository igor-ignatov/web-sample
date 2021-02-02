import { SET_USERS_LIST, SET_USERS_FETCHING_STATE, SET_USERS_FETCHING_ERROR_STATE, SET_DEALERS_LIST } from "../../redux/constants";

import { IUser } from "../../common/types/session";
import { IDealer } from "../../common/types/dealers";

export const set_users_list = (users: IUser[]) => ({
  type: SET_USERS_LIST,
  users
});

export const set_dealers_list = (dealers: IDealer[]) => ({
  type: SET_DEALERS_LIST,
  dealers
});

export const set_users_fetching_state = (state: boolean) => ({
  type: SET_USERS_FETCHING_STATE,
  state
});

export const set_users_fetching_error_state = (error: boolean) => ({
  type: SET_USERS_FETCHING_ERROR_STATE,
  error
});
