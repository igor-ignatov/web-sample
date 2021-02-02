import type { IRootState } from "../../../redux/types";

export interface Props {
  actions: any;
  store: IRootState;
}

export interface State {
  roles: Array<{ name: string; code: string }>;
  name: string;
  login: string;
  email: string;
  phone: string;
  dlr_id: string;
  role: string;
  ready: boolean;
  busy: boolean;
  error: boolean;
}
