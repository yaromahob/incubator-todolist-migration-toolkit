import {taskApi, TaskStatusesType, TTaskApi, UpdateTaskModelType} from "../api/task-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {RequestStatusType, setAppStatus} from "../App/app-reducer";
import axios, {AxiosError} from "axios";
import {RESULT_CODE} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {
  addTodolistAC,
  AddTodolistACType,
  removeTodolistAC,
  RemoveTodolistACType, setTodoListsAC,
  SetTodoListsACType
} from "./todolist-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {
    getTasksAC(state, action: PayloadAction<{ todolistID: string, tasks: TTaskApi[] }>) {
      state[action.payload.todolistID] = action.payload.tasks.map(t => ({
        ...t, entityStatus: 'idle'
      }));
    },
    removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistID: string }>) {
      const index = state[action.payload.todolistID].findIndex(t => t.id === action.payload.taskId);
      state[action.payload.todolistID].splice(index, 1);
    },
    addTaskAC(state, action: PayloadAction<{ todolistID: string, task: TTaskApi }>) {
      state[action.payload.todolistID].unshift({...action.payload.task, entityStatus: 'idle'});
    },
    changeTaskStatusAC(state, action: PayloadAction<{ todolistID: string, taskID: string, status: TaskStatusesType }>) {
      const taskIndex = state[action.payload.todolistID].findIndex(t => t.id === action.payload.taskID);
      
      state[action.payload.todolistID][taskIndex].status = action.payload.status;
    },
    
    changeTaskTitleAC(state, action: PayloadAction<{ todolistID: string, taskID: string, title: string }>) {
      const taskIndex = state[action.payload.todolistID].findIndex(t => t.id === action.payload.taskID);
      
      state[action.payload.todolistID][taskIndex].title = action.payload.title;
    },
    
    changeEntityStatusAC(state, action: PayloadAction<{ todolistID: string, taskID: string, entityStatus: RequestStatusType }>) {
      const taskIndex = state[action.payload.todolistID].findIndex(t => t.id === action.payload.taskID);
      
      state[action.payload.todolistID][taskIndex].entityStatus = action.payload.entityStatus;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolistId] = [];
    });
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.id];
    });
    builder.addCase(setTodoListsAC, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state[tl.id] = [];
      });
    });
    
  }
});

export const tasksReducer = tasksSlice.reducer;
export const {
  changeEntityStatusAC,
  changeTaskStatusAC,
  getTasksAC,
  changeTaskTitleAC,
  removeTaskAC,
  addTaskAC
} = tasksSlice.actions;


// thunk

export const getTasksTC = (todolistID: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({value: 'loading'}));
  taskApi.getTasks(todolistID)
    .then((res) => {
      dispatch(getTasksAC({todolistID, tasks: res.data.items}));
      dispatch(setAppStatus({value: 'succeeded'}));
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
    });
};

export const deleteTaskTC = (todolistID: string, taskID: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({value: 'loading'}));
  dispatch(changeEntityStatusAC({todolistID, taskID, entityStatus: 'loading'}));
  taskApi.deleteTask(todolistID, taskID)
    .then((res) => {
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(removeTaskAC({todolistID: todolistID, taskId: taskID}));
        dispatch(setAppStatus({value: 'succeeded'}));
      }
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
    });
};

export const addTaskTC = (todolistID: string, title: string) =>
  async (dispatch: Dispatch) => {
    dispatch(setAppStatus({value: 'loading'}));
    
    try {
      const res = await taskApi.createTask(todolistID, title);
      
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(addTaskAC({todolistID, task: res.data.data.item}));
        dispatch(setAppStatus({value: 'succeeded'}));
      } else {
        handleServerAppError<{ item: TTaskApi }>(dispatch, res.data);
      }
      dispatch(setAppStatus({value: 'failed'}));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(dispatch, error);
      }
    }
  };

export const updateTaskTitleTC = (todolistID: string, taskID: string, title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({value: 'loading'}));
  dispatch(changeEntityStatusAC({todolistID, taskID, entityStatus: 'loading'}));
  taskApi.updateTaskTitle(todolistID, taskID, title)
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(changeTaskTitleAC({todolistID, taskID, title}));
        dispatch(setAppStatus({value: 'succeeded'}));
        dispatch(changeEntityStatusAC({todolistID, taskID, entityStatus: 'succeeded'}));
      } else {
        handleServerAppError<{}>(dispatch, res.data);
      }
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
    });
};


export const updateTaskTC = (todolistID: string, taskID: string, status: TaskStatusesType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
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
    dispatch(setAppStatus({value: 'loading'}));
    
    taskApi.updateTask(todolistID, taskID, model)
      .then(res => {
        dispatch(changeTaskStatusAC({todolistID, taskID, status: res.data.data.item.status}));
        dispatch(setAppStatus({value: 'succeeded'}));
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


export type TasksStateType = {
  [key: string]: Array<TTaskApi & TasksDomainType>
}

export type TasksDomainType = {
  entityStatus: RequestStatusType
}
