import { TOGGLE_THEME } from "../../redux/constants";

export const toggle_theme_api = (theme: string) => {
  return {
    type: TOGGLE_THEME,
    theme
  };
};
