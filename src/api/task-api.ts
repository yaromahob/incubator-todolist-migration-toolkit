import {instance} from "./axios-instance";

export const taskApi = {
  getTasks(todolistID: string) {
    
    return instance.get<TTaskResponse>(`todo-lists/${todolistID}/tasks`);
  },
  createTask(todolistID: string, title: string) {
    
    return instance.post<ResponseTaskType<{ item: TTaskApi }>>(`todo-lists/${todolistID}/tasks`, {title: title});
  },
  updateTaskTitle(todolistID: string, taskID: string, title: string) {
    
    return instance.put<ResponseTaskType<{}>>(`todo-lists/${todolistID}/tasks/${taskID}`, {title});
  },
  updateTask(todolistID: string, taskID: string, model: UpdateTaskModelType) {
    return instance.put<ResponseTaskType<{ item: UpdateTaskModelType }>>(`todo-lists/${todolistID}/tasks/${taskID}`, model);
  },
  deleteTask(todolistID: string, taskID: string) {
    return instance.delete<ResponseTaskType<{}>>(`todo-lists/${todolistID}/tasks/${taskID}`);
  }
};

export type UpdateTaskModelType = {
  title: string
  description: string
  completed: boolean
  status: TaskStatusesType
  priority: TaskPrioritiesType
  startDate: string
  deadline: string
}


export type TTaskResponse = {
  items: Array<TTaskApi>
  totalCount: number
  error: null
}

export enum TaskStatusesType {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3
}

export enum TaskPrioritiesType {
  Low,
  Middle,
  Hi,
  Urgently,
  Later
}


export type TTaskApi = {
  addedDate: string
  deadline: string
  description: string
  id: string
  order: number
  priority: number
  startDate: string
  status: number
  title: string
  todoListId: string
}

type ResponseTaskType<T> = {
  data: T
  fieldsErrors: Array<string>
  messages: Array<string>
  resultCode: number
}
