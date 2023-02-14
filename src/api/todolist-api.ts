import {instance} from "./axios-instance";
import {AxiosResponse} from "axios";

export const todolistApi = {
  getTodolists() {
    return instance.get<Array<TTodolistApi>>(`todo-lists`);
  },
  createTodolist(todolistTitle: string) {
    return instance.post<ResponseType<{ item: TTodolistApi }>>('todo-lists', {title: todolistTitle});
  },
  updateTodolist(todolistID: string, newTitle: string) {
    return instance.put<{ newTitle: string }, AxiosResponse<ResponseType>>(`todo-lists/${todolistID}`, {title: newTitle});
  },
  deleteTodolist(todolistID: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistID}`);
  }
};


export type TTodolistApi = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
}

export type ResponseType<T = {}> = {
  data: T
  fieldsErrors: Array<string>
  messages: Array<string>
  resultCode: number
}

export enum RESULT_CODE {
  SUCCESS = 0,
  ERROR = 1,
  CAPTCHA = 10
}