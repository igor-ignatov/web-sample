
import type { IUser } from "../../../common/types/session";
import type { IRootState } from "../../../redux/types";

export interface Props {
  user: IUser;
  actions: any;
  store: IRootState;
}

export interface State {
  roles: Array<{ name: string; code: string }>;
  name: string;
  login: string;
  email: string;
  phone: string;
  role: string;
  dlr_id: string;
  ready: boolean;
  busy: boolean;
  error: boolean;
}
