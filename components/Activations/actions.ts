import { SET_FETCH_ACTIVATIONS_STATE, SET_ACTIVATIONS_PAGE, SET_FETCH_ACTIVATIONS_ERROR, TOGGLE_ACTIVATIONS_FILTER, SET_FETCH_ACTIVATIONS_RESULT } from "../../redux/constants";
import { IActivation } from "../../common/types/activations";

export const set_activations_list = (list: IActivation[]) => ({
  type: SET_FETCH_ACTIVATIONS_RESULT,
  list
});

export const set_fetching_state = (state: boolean) => ({
  type: SET_FETCH_ACTIVATIONS_STATE,
  state
});

export const set_fetching_error = (error: boolean) => ({
  type: SET_FETCH_ACTIVATIONS_ERROR,
  error
});

export const toggle_activations_filter = (filter: { key: string, value: any }) => ({
  type: TOGGLE_ACTIVATIONS_FILTER,
  filter
});

export const set_activations_page = (page: number) => ({
  type: SET_ACTIVATIONS_PAGE,
  page
});
