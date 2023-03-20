import {RESULT_CODE, todolistApi, TTodolistApi} from "../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatus} from "../App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = [];

const todolistSlice = createSlice({
  name: 'todolists',
  initialState: initialState,
  reducers: {
    addTodolist(state, action: PayloadAction<{ title: string, todolistId: string }>) {
      state.unshift({
        id: action.payload.todolistId,
        title: action.payload.title,
        filter: "all",
        entityStatus: 'idle',
        addedDate: '',
        order: 0,
      });
    },
    removeTodolist(state, action: PayloadAction<{ id: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state.splice(index, 1);
      
    },
    changeTodolistTitle(state, action: PayloadAction<{ id: string, title: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].title = action.payload.title;
      
    },
    changeFilter(state, action: PayloadAction<{ filter: FilterValuesType, id: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    setTodoLists(state, action: PayloadAction<{ todolists: TTodolistApi[] }>) {
      return action.payload.todolists.map((tl: TTodolistApi) =>
        ({...tl, filter: "all", entityStatus: 'idle',}));
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ todolistID: string, entityStatus: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.todolistID);
      state[index].entityStatus = action.payload.entityStatus;
    },
  }
  
});


export const todolistsReducer = todolistSlice.reducer;
export const {
  addTodolist,
  removeTodolist,
  changeTodolistTitle,
  changeTodolistEntityStatus,
  changeFilter,
  setTodoLists
} = todolistSlice.actions;

// thunks

export const getTodolistTC = () =>
  async (dispatch: Dispatch) => {
    
    dispatch(setAppStatus({value: 'loading'}));
    
    try {
      const res = await todolistApi.getTodolists();
      
      dispatch(setTodoLists({todolists: res.data}));
      dispatch(setAppStatus({value: 'succeeded'}));
      
    } catch (e) {
      
      if (axios.isAxiosError(e)) {
        
        const error = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(dispatch, error);
        
      }
    }
  };

export const createTodoListTC = (todolistTitle: string) =>
  async (dispatch: Dispatch) => {
    
    dispatch(setAppStatus({value: 'loading'}));
    
    try {
      const res = await todolistApi.createTodolist(todolistTitle);
      
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        
        dispatch(addTodolist({title: res.data.data.item.title, todolistId: res.data.data.item.id}));
        dispatch(setAppStatus({value: 'succeeded'}));
        
      } else {
        handleServerAppError(dispatch, res.data);
      }
      
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(dispatch, error);
      }
    }
  };

export const updateTodolistTitleTC = (todolistID: string, newTodolistTitle: string) =>
  async (dispatch: Dispatch) => {
    
    dispatch(setAppStatus({value: 'loading'}));
    
    try {
      const res = await todolistApi.updateTodolist(todolistID, newTodolistTitle);
      
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        
        dispatch(changeTodolistTitle({title: newTodolistTitle, id: todolistID}));
        dispatch(setAppStatus({value: 'succeeded'}));
        
      } else {
        handleServerAppError(dispatch, res.data);
      }
    } catch (e) {
      
      if (axios.isAxiosError(e)) {
        const error = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(dispatch, error);
      }
    }
  };

export const removeTodoListTC = (todolistID: string) =>
  async (dispatch: Dispatch) => {
    
    dispatch(setAppStatus({value: 'loading'}));
    dispatch(changeTodolistEntityStatus({todolistID: todolistID, entityStatus: 'loading'}));
    
    try {
      const res = await todolistApi.deleteTodolist(todolistID);
      
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        
        dispatch(removeTodolist({id: todolistID}));
        dispatch(setAppStatus({value: 'succeeded'}));
        
      } else {
        handleServerAppError(dispatch, res.data);
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        
        const error = e.response ? e.response.data.message : e.message;
        dispatch(changeTodolistEntityStatus({todolistID: todolistID, entityStatus: 'idle'}));
        handleServerNetworkError(dispatch, error);
        
      }
    }
  };

// types

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TTodolistApi & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
