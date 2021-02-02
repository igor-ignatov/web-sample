import { SET_SEARCH_STRING, SET_SEARCH_MODE } from "../../redux/constants";

export const set_search_string = (str: string) => ({
  type: SET_SEARCH_STRING,
  str
});

export const set_search_mode = (mode: string) => ({
  type: SET_SEARCH_MODE,
  mode
});
