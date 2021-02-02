import { batch } from "react-redux";

import * as UsersActions from "./actions";

import type { IUser } from "../../common/types/session";
import type { IDealer } from "../../common/types/dealers";
import type { ThunkResult } from "../../redux/types";

export const set_users_list_api = (users: IUser[]): ThunkResult<void> => (dispatch) => dispatch(UsersActions.set_users_list(users));

export const set_dealers_list_api = (dealers: IDealer[]): ThunkResult<void> => (dispatch) => dispatch(UsersActions.set_dealers_list(dealers));

const set_users_fetching_state_api = (state: boolean): ThunkResult<void> => (dispatch) => dispatch(UsersActions.set_users_fetching_state(state));

const set_users_fetching_error_state_api = (error: boolean): ThunkResult<void> => (dispatch) => dispatch(UsersActions.set_users_fetching_error_state(error));

export function get_users_list_api(): ThunkResult<Promise<{ users: IUser[], dealers: IDealer[] }>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      batch(() => {
        dispatch(set_users_fetching_state_api(true));
        dispatch(set_users_fetching_error_state_api(false));
      });

      dispatch(mtx.fetch("/api_v1/users/list"))
        .then((result: { users: IUser[], dealers: IDealer[] }) => {
          batch(() => {
            dispatch(set_users_fetching_state_api(false));
            dispatch(set_users_list_api(result.users));
            dispatch(set_dealers_list_api(result.dealers));
          });

          resolve(result);
        })
        .catch((error) => {
          batch(() => {
            dispatch(set_users_fetching_state_api(false));
            dispatch(set_users_fetching_error_state_api(true));
          });

          reject(error);
        });
    });
}

export function create_user_api(login: string, role: string, name: string, email: string, phone: string, dlr_id: string): ThunkResult<Promise<any>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      dispatch(mtx.fetch("/api_v1/users/create", { body: JSON.stringify({ login, role, name, email, phone, dlr_id }) }))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
}

export function update_user_api(data: any, _id: string): ThunkResult<Promise<any>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      dispatch(mtx.fetch("/api_v1/users/update", { body: JSON.stringify({ data, _id }) }))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
}

export function resend_user_password_api(_id: string): ThunkResult<Promise<any>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      dispatch(mtx.fetch("/api_v1/users/send_password", { body: JSON.stringify({ _id }) }))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
}

export function fetch_dealers_api(): ThunkResult<Promise<any>> {
  return (dispatch, getState, { mtx }) => {
    return new Promise((resolve, reject) => {
      dispatch(mtx.fetch("/api_v1/dealers/list", {}))
        .then((result: IDealer[]) => {
          dispatch(set_dealers_list_api(result));

          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
