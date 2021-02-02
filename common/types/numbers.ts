import type { Details as UserAgentData } from "express-useragent";
import type { IUser } from "./session";

export interface IGetNumbersOptions {
  query?: Array<{
    key: string;
    value: string;
  }>;
  sort?: {
    key: string;
    direction: any;
  };
  group?: string;
}

export interface ICustomer {
  id: string;
  name: string;
  inn: string;
  contract_number: string;
}

export interface IBalanceItem {
  type: string;
  name: string;
  val: string;
  ava: string;
  tot: string;
}

export type INumbersStatus = [string, number];

export interface ISimpleNumber {
  activation_date: string;
  balance: string;
  client: string;
  contract_number: string;
  end_date: string;
  inn: string;
  number: string;
  start_date: string;
  status: string;
  tariff: string;
  usid: string;
  dlr_id: string;
}

export interface INumberGroup {
  group: string;
  data: INumber[];
}

export type INumber = ISimpleNumber & INumberGroup;

export interface IPackItem {
  abon_amt: string;
  avaliable: boolean;
  end_date: string;
  id: string;
  name: string;
  next_bdat: string;
  start_amt: string;
  start_date: string;
  status: string;
}

export interface INumberActionsLog {
  user: IUser;
  data: any;
  request: { url: string; ip: string } & UserAgentData;
  date: string;
  number: string;
  _id: string;
}

export interface INumberInfo {
  activation_date: string;
  agr: IBalanceItem[];
  balance: string;
  balance_limit: string;
  billing_model: string;
  billing_model_real: string;
  customer: ICustomer;
  contract_number: string;
  id: string;
  inn: string;
  name: string;
  end_date: string;
  icc: string;
  limit: string;
  matrix_packs: IPackItem[];
  number: string;
  request_history: INumberActionsLog[];
  start_date: string;
  status: string;
  tariff: string;
  usid: string;
}

export interface INumbersResponse {
  l: number;
  tariffs: string[];
  statuses: INumbersStatus[];
  dealers: string[];
  numbers: INumber[];
}
