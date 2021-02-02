import type { INumberInfo } from "../../common/types/numbers";

export interface Props {
  actions: any;
  number: INumberInfo;
}

export interface State {
  busy: boolean;
  error: boolean;
  company_name: string;
  inn: string;
  contract_number: string;
  contract: string;
}
