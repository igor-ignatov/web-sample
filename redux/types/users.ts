import { IUser } from "../../common/types/session";
import { IDealer } from "../../common/types/dealers";

export interface IUsersState {
  users: IUser[];
  dealers: IDealer[];
  isFetching: false;
  error: false;
}
