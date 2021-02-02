import type { IRootState } from "../../redux/types";

export interface State {
  total: number;
  pages: Array<number>;
  lp: number;
}

export interface Props {
  store: IRootState;
  actions: any;
}
