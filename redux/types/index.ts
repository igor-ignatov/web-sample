import type { ThunkAction } from "redux-thunk";
import type { Action } from "redux";

import type { IGlobalSiteReducer } from "./global";
import type { INumberViewState } from "./number";
import type { INumbersState } from "./numbers";
import type { IDetailState } from "./detail";
import type { IActivationsState } from "./activations";
import type { IUsersState } from "./users";
import type { ISerachNumberState } from "./search_number";

export interface IRootState {
  global_site_reducer: IGlobalSiteReducer;
  number_view_reducer: INumberViewState;
  number_list_reducer: INumbersState;
  detail_reducer: IDetailState;
  activations_reducer: IActivationsState;
  search_number_reducer: ISerachNumberState;
  users_reducer: IUsersState;
}

export type ThunkResult<R> = ThunkAction<R, IRootState, { mtx: any }, Action<any>>;
