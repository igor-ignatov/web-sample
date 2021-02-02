export interface IDetailItem {
  Amount: string;
  Date: string;
  Dialled: string;
  Direction: string;
  Quantity: string;
  Service: string;
  Type: string;
  Unit: string;
  id: string;
}

export interface IDetail {
  traffic: IDetailItem[];
}
