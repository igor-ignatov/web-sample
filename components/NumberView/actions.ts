import { SET_SELECTED_NUMBER, GET_NUMBER_INFO_FETCH_STATE } from "../../redux/constants";

import { INumberInfo } from "../../common/types/numbers";

export const set_selected_number = (number: INumberInfo) => ({
  type: SET_SELECTED_NUMBER,
  number
});

export const set_fetch_state = (state: boolean) => ({
  type: GET_NUMBER_INFO_FETCH_STATE,
  state
});
