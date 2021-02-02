import { IActivation } from "../../common/types/activations";

export interface IActivationsState {
  activations: { data: IActivation[], l: number };
  filters: Array<{ key: string, value: any }>;
  isFetching: boolean;
  error: boolean;
  onPage: number;
  page: number;
}
