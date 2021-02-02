import { IDetail } from "../../common/types/detail";

export interface IDetailState {
  detail: IDetail;
  isFetching: boolean;
  error: boolean;
}
