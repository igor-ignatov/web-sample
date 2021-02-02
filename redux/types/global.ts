import { IUser } from "../../common/types/session";

export interface IGlobalSiteReducer {
  user_data: IUser;
  app_ready: boolean;
  isLogin: boolean;
  theme: "bp3-dark" | "bp3-light"
}
