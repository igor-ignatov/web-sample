import type { IRootState } from "../../redux/types";

export interface Props {
  store: IRootState;
  current_period: string;
  number: string;
}

export interface State {
  periods: Array<{ name: string; value: string }>;
}
