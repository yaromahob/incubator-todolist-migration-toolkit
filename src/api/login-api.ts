import {instance} from "./axios-instance";
import {AxiosResponse} from "axios";
import {ResponseType} from './todolist-api';

export const loginApi = {
  authMe() {
    return instance.get<ResponseType<UserType>>('auth/me/');
  },
  logIn(data: LoginDataType) {
    return instance.post<LoginDataType, AxiosResponse<ResponseType>>('/auth/login', data);
  },
  logOut() {
    return instance.delete<ResponseType>('/auth/login');
  }
};

// types

export type LoginDataType = {
  email: string
  password: string
  rememberMe?: boolean
  captcha?: string
}

export type UserType = {
  id: string
  email: string
  login: string
}