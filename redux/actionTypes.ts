import type { IActivation } from "../common/types/activations";
import type { IDetail } from "../common/types/detail";
import type { INumber, INumbersStatus, INumberInfo } from "../common/types/numbers";
import type { IUser } from "../common/types/session";
import type { IDealer } from "../common/types/dealers";

export interface ActivationsActionTypes {
  type: string;
  list: IActivation[];
  filter?: {key: string, value: any};
  state: boolean;
  error: boolean;
  page: number;
}

export interface DetailActionTypes {
  type: string;
  detail: IDetail[];
  state: boolean;
  error: boolean;
}

export interface NumbersActionTypes {
  type: string;
  list?: INumber[];
  statuses?: INumbersStatus[];
  length?: number;
  filter?: {key: string, value: any};
  page?: number;
  group?: string;
  state?: boolean;
  tariffs?: string[];
  dealers?: string[];
  sort?: {key: string, direction: string};
}

export interface NumberViewActionTypes {
  type: string;
  number: INumberInfo;
  state: boolean;
}

export interface ISerachNumberActionTypes {
  type: string;
  str: string;
  mode: string;
}

export interface IUsersActionTypes {
  type: string;
  users: IUser[];
  dealers: IDealer[];
  state: boolean;
  error: boolean
}
