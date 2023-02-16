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

// type ActionsType =
//   | RemoveTodolistACType
//   | AddTodolistACType
//   | ChangeTodolistTitleACType
//   | ChangeFilterACType
//   | SetTodoListsACType
//   | ChangeTodolistEntityStatusACType


export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
export type AddTodolistACType = ReturnType<typeof addTodolistAC>
export type SetTodoListsACType = ReturnType<typeof setTodoListsAC>
// export type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
// export type ChangeFilterACType = ReturnType<typeof changeFilterAC>
// export type ChangeTodolistEntityStatusACType = ReturnType<typeof changeTodolistEntityStatusAC>


//   (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
//   switch (action.type) {
//     case 'REMOVE-TODOLIST':
//       return state.filter(t => t.id !== action.payload.id);
//
//     case "ADD-TODOLIST":
//
//       return [
//         {
//           id: action.payload.todolistId,
//           title: action.payload.title,
//           filter: "all",
//           entityStatus: 'idle',
//           addedDate: '',
//           order: 0,
//         },
//         ...state
//       ];
//
//     case "CHANGE-TODOLIST-TITLE": {
//       return state.map(el => el.id === action.payload.id
//         ? {...el, title: action.payload.title}
//         : el);
//     }
//
//     case 'CHANGE-TODOLIST-FILTER': {
//       return state.map(el => el.id === action.payload.id
//         ? {...el, filter: action.payload.filter}
//         : el);
//     }
//
//     case "SET-TODOLISTS": {
//       return action.payload.map((tl: any) =>
//         ({...tl, filter: "all", entityStatus: 'idle',}));
//     }
//
//     case "SET-ENTITY-STATUS": {
//       return state.map(tl => tl.id === action.payload.todolistID ? {
//         ...tl,
//         entityStatus: action.payload.entityStatus
//       } : tl);
//     }
//
//     default:
//       return state;
//   }
// };

// actions

// export const removeTodolistAC = (id: string) => {
//   return {
//     type: 'REMOVE-TODOLIST',
//     payload: {
//       id
//     }
//   } as const;
// };
//
// export const addTodolistAC = (title: string, todolistId: string) => {
//   return {
//     type: 'ADD-TODOLIST',
//     payload: {
//       title,
//       todolistId
//     }
//   } as const;
// };
//
// export const changeTodolistTitleAC = (id: string, title: string) => {
//   return {
//     type: 'CHANGE-TODOLIST-TITLE',
//     payload: {
//       id,
//       title,
//     }
//   } as const;
// };
//
// export const changeFilterAC = (filter: FilterValuesType, id: string) => {
//   return {
//     type: 'CHANGE-TODOLIST-FILTER',
//     payload: {
//       id,
//       filter
//     }
//   } as const;
// };
//
// export const setTodoListsAC = (todolists: TTodolistApi[]) => {
//   return {
//     type: 'SET-TODOLISTS',
//     payload: todolists
//   } as const;
// };
//
// export const changeTodolistEntityStatusAC =
//   (todolistID: string, entityStatus: RequestStatusType) =>
//     ({type: 'SET-ENTITY-STATUS', payload: {entityStatus, todolistID}} as const);