import type { Details } from "express-useragent";

export interface IUser {
  _id: string;
  id: string;
  name: string;
  login: string;
  pass: string;
  email: string;
  phone: string;
  role: string;
  dlr_id: string;
  online?: boolean;
  last_seen?: number;
  ip?: string;
  sessions?: Array<{ id: string; ip: string; os: string; platform: string; v: string; browser: string; isMobile: boolean }>;
}

export interface ISession {
  user: IUser;
  verify: boolean;
  detail?: string;
  ua?: Details;
}
