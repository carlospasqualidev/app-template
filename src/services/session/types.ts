import type { IUser } from "@/types/user/types";

export interface ISignInService {
  email: string;
  password: string;
}

export interface ISignUpService {
  name: string;
  email: string;
  password: string;
}

export interface ISessionResponse {
  user: IUser;
}

export interface IValidateResponse {
  user: IUser;
}
