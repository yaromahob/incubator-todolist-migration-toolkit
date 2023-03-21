import {RESULT_CODE, todolistApi, TTodolistApi} from "../api/todolist-api";
import {RequestStatusType, setAppStatus} from "../App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const getTodoList = createAsyncThunk('todoLists/getTodolist', async (_, {dispatch}) => {
  
    dispatch(setAppStatus({value: 'loading'}));
  
  try {
    const res = await todolistApi.getTodolists();
  
    dispatch(setAppStatus({value: 'succeeded'}));
    return {todolists: res.data}
    
  } catch (e) {
    
    if (axios.isAxiosError(e)) {
      
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
      
    }
  }
})

export const createTodoList = createAsyncThunk('todoLists/createTodoList', async (todolistTitle: string, {dispatch}) => {
  dispatch(setAppStatus({value: 'loading'}));
  
  try {
    const res = await todolistApi.createTodolist(todolistTitle);
    
    if (res.data.resultCode === RESULT_CODE.SUCCESS) {
      
      dispatch(setAppStatus({value: 'succeeded'}));
      return {title: res.data.data.item.title, todolistId: res.data.data.item.id}
      
    } else {
      handleServerAppError(dispatch, res.data);
    }
    
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
    }
  }
})

export const updateTodoListTitle = createAsyncThunk('todoLists/updateTodoListTitle', async (param: {todolistId: string, title: string}, {dispatch}) => {
  const {todolistId, title} = param
  
  dispatch(setAppStatus({value: 'loading'}));
  
  try {
    const res = await todolistApi.updateTodolist(todolistId, title);
    
    if (res.data.resultCode === RESULT_CODE.SUCCESS) {
      
      dispatch(setAppStatus({value: 'succeeded'}));
      return {title: title, id: todolistId}
      
    } else {
      handleServerAppError(dispatch, res.data);
    }
  } catch (e) {
    
    if (axios.isAxiosError(e)) {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
    }
  }
})

export const removeTodoList = createAsyncThunk('todoLists/removeTodoList', async (todolistID: string, {dispatch}) => {
  
  dispatch(setAppStatus({value: 'loading'}));
  dispatch(changeTodolistEntityStatus({todolistID: todolistID, entityStatus: 'loading'}));
  
  try {
    const res = await todolistApi.deleteTodolist(todolistID);
    
    if (res.data.resultCode === RESULT_CODE.SUCCESS) {
      
      dispatch(setAppStatus({value: 'succeeded'}));
      // dispatch(removeTodolist({id: todolistID}));
      return {todolistID}
      
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
})

const todolistSlice = createSlice({
  name: 'todoLists',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeFilter(state, action: PayloadAction<{ filter: FilterValuesType, id: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    
    changeTodolistEntityStatus(state, action: PayloadAction<{ todolistID: string, entityStatus: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.todolistID);
      state[index].entityStatus = action.payload.entityStatus;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTodoList.fulfilled, (state, action) => {
      if (action.payload) {
        return action.payload.todolists.map((tl: TTodolistApi) =>
          ({...tl, filter: "all", entityStatus: 'idle',}))
      }
    });
    
    builder.addCase(createTodoList.fulfilled, (state, action) => {
      if (action.payload) {
        state.unshift({
          id: action.payload.todolistId,
          title: action.payload.title,
          filter: "all",
          entityStatus: 'idle',
          addedDate: '',
          order: 0,
        });
      }
    });
    
    builder.addCase(updateTodoListTitle.fulfilled, (state, action) => {
      if(action.payload) {
        const index = state.findIndex(tl => tl.id === action.payload!.id);
        state[index].title = action.payload.title;
      }
    });
    
    builder.addCase(removeTodoList.fulfilled, (state, action) => {
      if (action.payload) {
        const index = state.findIndex(tl => tl.id === action.payload!.todolistID);
        state.splice(index, 1);
      }
    });
  }
  
});


export const todolistsReducer = todolistSlice.reducer;
export const {
  changeTodolistEntityStatus,
  changeFilter,
} = todolistSlice.actions;


// types

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TTodolistApi & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
