import { INumbersStatus, INumber } from "../../common/types/numbers";

export interface INumbersState {
  list: INumber[];
  statuses: INumbersStatus[];
  tariffs: string[];
  dealers: Array<{ id: string; name: string }>;
  group: string;
  busy: boolean;
  filters: Array<{ key: string, value: any }>;
  sort: { key: string, direction: string } | null;
  onPage: number;
  total: number;
  page: number;
}
