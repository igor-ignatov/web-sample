import { SET_LOGIN_STATE } from "../../redux/constants";

export const set_sign_in_state = (state: boolean) => ({
  type: SET_LOGIN_STATE,
  state
});
