import {taskApi, TaskStatusesType, TTaskApi, UpdateTaskModelType} from "../api/task-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {RequestStatusType, setAppStatus} from "../App/app-reducer";
import axios from "axios";
import {RESULT_CODE} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {addTodolist, removeTodolist, setTodoLists} from "./todolist-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistID: string, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({value: 'loading'}));
  
  const res = await taskApi.getTasks(todolistID);
  const tasks = res.data.items;
  console.log(tasks);
  thunkAPI.dispatch(setAppStatus({value: 'succeeded'}));
  return {todolistID, tasks};
  
  // .catch((e: AxiosError<{ message: string }>) => {
  //   const error = e.response ? e.response.data.message : e.message;
  //   handleServerNetworkError(thunkAPI.dispatch, error);
  // });
});

export const addTaskTC = createAsyncThunk('tasks/addTaskTC', async (param: { todolistId: string, title: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({value: 'loading'}));
  
  try {
    const res = await taskApi.createTask(param.todolistId, param.title);
    
    if (res.data.resultCode === RESULT_CODE.SUCCESS) {
      const todolistID = param.todolistId
      const task = res.data.data.item;
      // thunkAPI.dispatch(addTask({todolistID, task: res.data.data.item}));
      thunkAPI.dispatch(setAppStatus({value: 'succeeded'}));
      return {todolistID, task}
    } else {
      handleServerAppError<{ item: TTaskApi }>(thunkAPI.dispatch, res.data);
    }
    thunkAPI.dispatch(setAppStatus({value: 'failed'}));
    
  } catch (e) {
    
    if (axios.isAxiosError(e)) {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(thunkAPI.dispatch, error);
    }
  }
})

export const deleteTasks = createAsyncThunk('tasks/deleteTasks', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({value: 'loading'}));
  thunkAPI.dispatch(changeEntityStatus({
    todolistId: param.todolistId,
    taskID: param.taskId,
    entityStatus: 'loading'
  }));
  const res = await taskApi.deleteTask(param.todolistId, param.taskId);
  thunkAPI.dispatch(setAppStatus({value: 'succeeded'}));
  return {todolistId: param.todolistId, taskId: param.taskId};
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {
    // addTask(state, action: PayloadAction<{ todolistID: string, task: TTaskApi }>) {
    //   state[action.payload.todolistID].unshift({...action.payload.task, entityStatus: 'idle'});
    // },
    changeTaskStatus(state, action: PayloadAction<{ todolistId: string, taskID: string, status: TaskStatusesType }>) {
      const taskIndex = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskID);
      
      state[action.payload.todolistId][taskIndex].status = action.payload.status;
    },
    changeTaskTitle(state, action: PayloadAction<{ todolistId: string, taskID: string, title: string }>) {
      const taskIndex = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskID);
      
      state[action.payload.todolistId][taskIndex].title = action.payload.title;
    },
    changeEntityStatus(state, action: PayloadAction<{ todolistId: string, taskID: string, entityStatus: RequestStatusType }>) {
      const taskIndex = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskID);
      
      state[action.payload.todolistId][taskIndex].entityStatus = action.payload.entityStatus;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolist, (state, action) => {
      state[action.payload.todolistId] = [];
    });
    builder.addCase(removeTodolist, (state, action) => {
      delete state[action.payload.id];
    });
    builder.addCase(setTodoLists, (state, action) => {
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
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      if(action.payload){
        state[action.payload.todolistID].unshift({...action.payload.task, entityStatus: 'idle'});
      }
    })
  }
});

export const tasksReducer = tasksSlice.reducer;
export const {
  changeEntityStatus,
  changeTaskStatus,
  changeTaskTitle,
  // addTask
} = tasksSlice.actions;


// thunk


// export const addTaskTC_ = (todolistID: string, title: string) =>
//   async (dispatch: Dispatch) => {
//     dispatch(setAppStatus({value: 'loading'}));
//
//     try {
//       const res = await taskApi.createTask(todolistID, title);
//
//       if (res.data.resultCode === RESULT_CODE.SUCCESS) {
//         dispatch(addTask({todolistID, task: res.data.data.item}));
//         dispatch(setAppStatus({value: 'succeeded'}));
//
//       } else {
//         handleServerAppError<{ item: TTaskApi }>(dispatch, res.data);
//       }
//       dispatch(setAppStatus({value: 'failed'}));
//
//     } catch (e) {
//
//       if (axios.isAxiosError(e)) {
//         const error = e.response ? e.response.data.message : e.message;
//         handleServerNetworkError(dispatch, error);
//       }
//     }
//   };

export const updateTaskTitleTC = (todolistId: string, taskID: string, title: string) =>
  async (dispatch: Dispatch) => {
    dispatch(setAppStatus({value: 'loading'}));
    dispatch(changeEntityStatus({todolistId, taskID, entityStatus: 'loading'}));
    
    try {
      const res = await taskApi.updateTaskTitle(todolistId, taskID, title);
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(changeTaskTitle({todolistId, taskID, title}));
        dispatch(setAppStatus({value: 'succeeded'}));
        dispatch(changeEntityStatus({todolistId, taskID, entityStatus: 'succeeded'}));
      } else {
        handleServerAppError<{}>(dispatch, res.data);
      }
      
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(dispatch, error);
      }
    }
  };


export const updateTaskTC = (todolistId: string, taskID: string, status: TaskStatusesType) =>
  async (dispatch: Dispatch, getState: () => AppRootStateType) => {
    
    const task = getState().tasks[todolistId].find((t) => t.id === taskID);
    
    try {
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
        
        const res = await taskApi.updateTask(todolistId, taskID, model);
        
        dispatch(setAppStatus({value: 'loading'}));
        dispatch(changeTaskStatus({todolistId, taskID, status: res.data.data.item.status}));
        dispatch(setAppStatus({value: 'succeeded'}));
        
      }
      
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(dispatch, error);
      }
    }
  };

// types


export type TasksStateType = {
  [key: string]: Array<TTaskApi & TasksDomainType>
}

export type TasksDomainType = {
  entityStatus: RequestStatusType
}
