import { SET_USER_DATA } from "../redux/constants";

export const set_user_data = (data: any) => ({
  type: SET_USER_DATA,
  data
});
