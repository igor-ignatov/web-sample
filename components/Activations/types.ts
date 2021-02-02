import type { IRootState } from "../../redux/types";

export interface State {
  sdat: any;
  edat: any;
  lp: number;
  total: number;
  pages: number[];
  error_contracts: number[];
  error_names: number[];
}

export interface Props {
  store: IRootState;
  actions: any;
}
