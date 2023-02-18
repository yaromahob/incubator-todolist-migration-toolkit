import {RESULT_CODE, todolistApi, TTodolistApi} from "../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatus} from "../App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = [];

const todolistSlice = createSlice({
  name: 'todolists',
  initialState: initialState,
  reducers: {
    addTodolistAC(state, action: PayloadAction<{ title: string, todolistId: string }>) {
      state.unshift({
        id: action.payload.todolistId,
        title: action.payload.title,
        filter: "all",
        entityStatus: 'idle',
        addedDate: '',
        order: 0,
      });
    },
    removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state.splice(index, 1);
      
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].title = action.payload.title;
      
    },
    changeFilterAC(state, action: PayloadAction<{ filter: FilterValuesType, id: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    setTodoListsAC(state, action: PayloadAction<{ todolists: TTodolistApi[] }>) {
      return action.payload.todolists.map((tl: TTodolistApi) =>
        ({...tl, filter: "all", entityStatus: 'idle',}));
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistID: string, entityStatus: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.todolistID);
      state[index].entityStatus = action.payload.entityStatus;
    },
  }
  
});


export const todolistsReducer = todolistSlice.reducer;
export const {
  addTodolistAC,
  removeTodolistAC,
  changeTodolistTitleAC,
  changeTodolistEntityStatusAC,
  changeFilterAC,
  setTodoListsAC
} = todolistSlice.actions;

// thunks

export const getTodolistTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus({value: 'loading'}));
  todolistApi.getTodolists()
    .then(res => {
      console.log('TODOLISTS', res.data);
      dispatch(setTodoListsAC({todolists: res.data}));
      dispatch(setAppStatus({value: 'succeeded'}));
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
    });
};

export const createTodoListTC = (todolistTitle: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({value: 'loading'}));
  todolistApi.createTodolist(todolistTitle)
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(addTodolistAC({title: res.data.data.item.title, todolistId: res.data.data.item.id}));
        dispatch(setAppStatus({value: 'succeeded'}));
      } else {
        handleServerAppError(dispatch, res.data);
      }
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
    });
};

export const updateTodolistTitleTC = (todolistID: string, newTodolistTitle: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({value: 'loading'}));
  todolistApi.updateTodolist(todolistID, newTodolistTitle)
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(changeTodolistTitleAC({title: newTodolistTitle, id: todolistID}));
        dispatch(setAppStatus({value: 'succeeded'}));
      } else {
        handleServerAppError(dispatch, res.data);
      }
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
    });
};

export const removeTodoListTC = (todolistID: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({value: 'loading'}));
  dispatch(changeTodolistEntityStatusAC({todolistID: todolistID, entityStatus: 'loading'}));
  todolistApi.deleteTodolist(todolistID)
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(removeTodolistAC({id: todolistID}));
        dispatch(setAppStatus({value: 'succeeded'}));
      } else {
        handleServerAppError(dispatch, res.data);
      }
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response ? e.response.data.message : e.message;
      dispatch(changeTodolistEntityStatusAC({todolistID: todolistID, entityStatus: 'idle'}));
      handleServerNetworkError(dispatch, error);
    });
};

// types

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TTodolistApi & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
