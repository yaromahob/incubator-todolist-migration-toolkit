import {taskApi, TaskStatusesType, TTaskApi, UpdateTaskModelType} from "../api/task-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {RequestStatusType, setAppStatus} from "../App/app-reducer";
import axios, {AxiosError} from "axios";
import {RESULT_CODE} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {
  addTodolistAC,
  removeTodolistAC,
  setTodoListsAC,
} from "./todolist-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistID: string, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({value: 'loading'}));
  
  const res = await taskApi.getTasks(todolistID);
  const tasks = res.data.items;
  thunkAPI.dispatch(setAppStatus({value: 'succeeded'}));
  return {todolistID, tasks};
  
  // .catch((e: AxiosError<{ message: string }>) => {
  //   const error = e.response ? e.response.data.message : e.message;
  //   handleServerNetworkError(thunkAPI.dispatch, error);
  // });
});

export const deleteTasks = createAsyncThunk('tasks/deleteTasks', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({value: 'loading'}));
  thunkAPI.dispatch(changeEntityStatusAC({
    todolistId: param.todolistId,
    taskID: param.taskId,
    entityStatus: 'loading'
  }));
  const res = await taskApi.deleteTask(param.todolistId, param.taskId);
  return {todolistId: param.todolistId, taskId: param.taskId};
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {
    addTaskAC(state, action: PayloadAction<{ todolistID: string, task: TTaskApi }>) {
      state[action.payload.todolistID].unshift({...action.payload.task, entityStatus: 'idle'});
    },
    changeTaskStatusAC(state, action: PayloadAction<{ todolistId: string, taskID: string, status: TaskStatusesType }>) {
      const taskIndex = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskID);
      
      state[action.payload.todolistId][taskIndex].status = action.payload.status;
    },
    changeTaskTitleAC(state, action: PayloadAction<{ todolistId: string, taskID: string, title: string }>) {
      const taskIndex = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskID);
      
      state[action.payload.todolistId][taskIndex].title = action.payload.title;
    },
    changeEntityStatusAC(state, action: PayloadAction<{ todolistId: string, taskID: string, entityStatus: RequestStatusType }>) {
      const taskIndex = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskID);
      
      state[action.payload.todolistId][taskIndex].entityStatus = action.payload.entityStatus;
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
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state[action.payload.todolistID] = action.payload.tasks.map(t => ({
        ...t, entityStatus: 'idle'
      }));
    });
    builder.addCase(deleteTasks.fulfilled, (state, action) => {
      const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId);
      state[action.payload.todolistId].splice(index, 1);
    });
  }
});

export const tasksReducer = tasksSlice.reducer;
export const {
  changeEntityStatusAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  addTaskAC
} = tasksSlice.actions;


// thunk


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

export const updateTaskTitleTC = (todolistId: string, taskID: string, title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({value: 'loading'}));
  dispatch(changeEntityStatusAC({todolistId, taskID, entityStatus: 'loading'}));
  taskApi.updateTaskTitle(todolistId, taskID, title)
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(changeTaskTitleAC({todolistId, taskID, title}));
        dispatch(setAppStatus({value: 'succeeded'}));
        dispatch(changeEntityStatusAC({todolistId, taskID, entityStatus: 'succeeded'}));
      } else {
        handleServerAppError<{}>(dispatch, res.data);
      }
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
    });
};


export const updateTaskTC = (todolistId: string, taskID: string, status: TaskStatusesType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
  const task = getState()
    .tasks[todolistId].find((t) => t.id === taskID);
  
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
    
    taskApi.updateTask(todolistId, taskID, model)
      .then(res => {
        dispatch(changeTaskStatusAC({todolistId, taskID, status: res.data.data.item.status}));
        dispatch(setAppStatus({value: 'succeeded'}));
      })
      .catch((e: AxiosError<{ message: string }>) => {
        const error = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(dispatch, error);
      });
  }
};

// types


export type TasksStateType = {
  [key: string]: Array<TTaskApi & TasksDomainType>
}

export type TasksDomainType = {
  entityStatus: RequestStatusType
}
