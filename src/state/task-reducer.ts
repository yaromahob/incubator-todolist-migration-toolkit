import {AddTodolistACType, RemoveTodolistACType, SetTodoListsACType} from "./todolist-reducer";
import {taskApi, TaskStatusesType, TTaskApi, UpdateTaskModelType} from "../api/task-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {RequestStatusType, SetErrorType, setAppStatus, SetStatusType} from "../App/app-reducer";
import axios, {AxiosError} from "axios";
import {RESULT_CODE} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState: TasksStateType = {};

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
  switch (action.type) {
    
    case "GET-TASKS": {
      return {
        ...state,
        [action.payload.todolistID]: action.payload.tasks.map(t => ({
          ...t, entityStatus: 'idle'
        }))
      };
    }
    
    case "REMOVE-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
      };
    }
    case "ADD-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: [{
          ...action.payload.task,
          entityStatus: 'idle'
        }, ...state[action.payload.todolistId]]
      };
    }
    
    case "CHANGE-TASK-STATUS": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map(t => t.id === action.payload.taskID ? {
          ...t,
          status: action.payload.status
        } : t)
      };
    }
    
    case "CHANGE-TASK-TITLE": {
      return {
        ...state,
        [action.payload.todolistId]: [...state[action.payload.todolistId].map(t => t.id === action.payload.taskID ? {
          ...t,
          title: action.payload.title
        } : t)]
      };
    }
    
    case "ADD-TODOLIST": {
      return {
        ...state,
        [action.payload.todolistId]: []
      };
    }
    
    case "REMOVE-TODOLIST": {
      const newTodoList = {...state};
      delete newTodoList[action.payload.id];
      // const {[action.payload.id]: [], ...rest} = {...state}
      return newTodoList;
    }
    
    
    case "SET-TODOLISTS": {
      let copyState = {...state};
      action.payload.forEach((tl) => {
        copyState[tl.id] = [];
      });
      // const allo = action.payload.map(tl => state[tl.id] = [...action.payload, entityStatus: 'idle'])
      return copyState;
    }
    case "CHANGE-STATUS": {
      console.log({
        ...state[action.payload.todolistID].map(t => t.id === action.payload.taskID ? {
          ...t,
          entityStatus: action.payload.entityStatus
        } : t)
      });
      return {
        ...state,
        [action.payload.todolistID]: state[action.payload.todolistID].map(t => t.id === action.payload.taskID ? {
          ...t,
          entityStatus: action.payload.entityStatus
        } : t)
      };
    }
    
    default:
      return state;
  }
};

// actions

export const removeTaskAC = (taskId: string, todolistId: string) =>
  ({type: 'REMOVE-TASK', payload: {taskId, todolistId}} as const);

export const addTaskAC = (todolistId: string, task: TTaskApi) =>
  ({type: 'ADD-TASK', payload: {todolistId, task: {...task}}} as const);

export const changeTaskStatusAC =
  (todolistId: string, taskID: string, status: TaskStatusesType) =>
    ({type: 'CHANGE-TASK-STATUS', payload: {todolistId, taskID, status}} as const);

export const changeTaskTitleAC = (todolistId: string, taskID: string, title: string) =>
  ({type: 'CHANGE-TASK-TITLE', payload: {todolistId, taskID, title}} as const);

export const getTasksAC = (todolistID: string, tasks: TTaskApi[]) =>
  ({type: 'GET-TASKS', payload: {todolistID, tasks: [...tasks]}} as const);

export const changeEntityStatusAC = (todolistID: string, taskID: string, entityStatus: RequestStatusType) => ({
  type: 'CHANGE-STATUS', payload: {todolistID, taskID, entityStatus}
} as const);

// thunk

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus('loading'));
  taskApi.getTasks(todolistId)
    .then((res) => {
      dispatch(getTasksAC(todolistId, res.data.items));
      dispatch(setAppStatus('succeeded'));
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
    });
};

export const deleteTaskTC = (todolistID: string, taskID: string) => (dispatch: Dispatch<ActionType>) => {
  dispatch(setAppStatus('loading'));
  dispatch(changeEntityStatusAC(todolistID, taskID, 'loading'));
  taskApi.deleteTask(todolistID, taskID)
    .then((res) => {
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(removeTaskAC(taskID, todolistID));
        dispatch(setAppStatus('succeeded'));
        dispatch(changeEntityStatusAC(todolistID, taskID, 'succeeded'));
      }
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
    });
};

export const addTaskTC = (todolistID: string, title: string) =>
  async (dispatch: Dispatch<ActionType>) => {
    dispatch(setAppStatus('loading'));
    
    try {
      const res = await taskApi.createTask(todolistID, title);
      
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(addTaskAC(todolistID, res.data.data.item));
        dispatch(setAppStatus('succeeded'));
      } else {
        handleServerAppError<{ item: TTaskApi }>(dispatch, res.data);
      }
      dispatch(setAppStatus('failed'));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(dispatch, error);
      }
    }
  };

export const updateTaskTitleTC = (todolistID: string, taskID: string, title: string) => (dispatch: Dispatch<ActionType>) => {
  dispatch(setAppStatus('loading'));
  dispatch(changeEntityStatusAC(todolistID, taskID, 'loading'));
  taskApi.updateTaskTitle(todolistID, taskID, title)
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(changeTaskTitleAC(todolistID, taskID, title));
        dispatch(setAppStatus('succeeded'));
        dispatch(changeEntityStatusAC(todolistID, taskID, 'succeeded'));
      } else {
        handleServerAppError<{}>(dispatch, res.data);
      }
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
    });
};


export const updateTaskTC = (todolistID: string, taskID: string, status: TaskStatusesType) => (dispatch: Dispatch<ActionType>, getState: () => AppRootStateType) => {
  const task = getState()
    .tasks[todolistID].find((t) => t.id === taskID);
  
  if (task) {
    const model: UpdateTaskModelType = {
      completed: false,
      title: task.title,
      deadline: task.deadline,
      status: status,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate
    };
    dispatch(setAppStatus('loading'));
    
    taskApi.updateTask(todolistID, taskID, model)
      .then(res => {
        dispatch(changeTaskStatusAC(todolistID, taskID, res.data.data.item.status));
        dispatch(setAppStatus('succeeded'));
      })
      .catch((e: AxiosError<{ message: string }>) => {
        const error = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(dispatch, error);
      });
  }
};

// types

type ActionType =
  ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof changeTaskStatusAC>
  | ReturnType<typeof changeTaskTitleAC>
  | ReturnType<typeof getTasksAC>
  | ReturnType<typeof changeEntityStatusAC>
  | AddTodolistACType
  | RemoveTodolistACType
  | SetTodoListsACType
  | SetStatusType
  | SetErrorType

export type TasksStateType = {
  [key: string]: Array<TTaskApi & TasksDomainType>
}

export type TasksDomainType = {
  entityStatus: RequestStatusType
}
