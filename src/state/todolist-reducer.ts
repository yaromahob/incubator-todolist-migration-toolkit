import {RESULT_CODE, todolistApi, TTodolistApi} from "../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatus, SetStatusType} from "../App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
  switch (action.type) {
    case 'REMOVE-TODOLIST':
      return state.filter(t => t.id !== action.payload.id);
    
    case "ADD-TODOLIST":
      
      return [
        {
          id: action.payload.todolistId,
          title: action.payload.title,
          filter: "all",
          entityStatus: 'idle',
          addedDate: '',
          order: 0,
        },
        ...state
      ];
    
    case "CHANGE-TODOLIST-TITLE": {
      return state.map(el => el.id === action.payload.id
        ? {...el, title: action.payload.title}
        : el);
    }
    
    case 'CHANGE-TODOLIST-FILTER': {
      return state.map(el => el.id === action.payload.id
        ? {...el, filter: action.payload.filter}
        : el);
    }
    
    case "SET-TODOLISTS": {
      return action.payload.map((tl) =>
        ({...tl, filter: "all", entityStatus: 'idle',}));
    }
    
    case "SET-ENTITY-STATUS": {
      return state.map(tl => tl.id === action.payload.todolistID ? {
        ...tl,
        entityStatus: action.payload.entityStatus
      } : tl);
    }
    
    default:
      return state;
  }
};

// actions

export const removeTodolistAC = (id: string) => {
  return {
    type: 'REMOVE-TODOLIST',
    payload: {
      id
    }
  } as const;
};

export const addTodolistAC = (title: string, todolistId: string) => {
  return {
    type: 'ADD-TODOLIST',
    payload: {
      title,
      todolistId
    }
  } as const;
};

export const changeTodolistTitleAC = (id: string, title: string) => {
  return {
    type: 'CHANGE-TODOLIST-TITLE',
    payload: {
      id,
      title,
    }
  } as const;
};

export const changeFilterAC = (filter: FilterValuesType, id: string) => {
  return {
    type: 'CHANGE-TODOLIST-FILTER',
    payload: {
      id,
      filter
    }
  } as const;
};

export const setTodoListsAC = (todolists: TTodolistApi[]) => {
  return {
    type: 'SET-TODOLISTS',
    payload: todolists
  } as const;
};

export const changeTodolistEntityStatusAC =
  (todolistID: string, entityStatus: RequestStatusType) =>
    ({type: 'SET-ENTITY-STATUS', payload: {entityStatus, todolistID}} as const);


// thunks

export const getTodolistTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus('loading'));
  todolistApi.getTodolists()
    .then(res => {
      dispatch(setTodoListsAC(res.data));
      dispatch(setAppStatus('succeeded'));
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response ? e.response.data.message : e.message;
      handleServerNetworkError(dispatch, error);
    });
};

export const createTodoListTC = (todolistTitle: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus('loading'));
  todolistApi.createTodolist(todolistTitle)
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(addTodolistAC(res.data.data.item.title, res.data.data.item.id));
        dispatch(setAppStatus('succeeded'));
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
  dispatch(setAppStatus('loading'));
  todolistApi.updateTodolist(todolistID, newTodolistTitle)
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(changeTodolistTitleAC(todolistID, newTodolistTitle));
        dispatch(setAppStatus('succeeded'));
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
  dispatch(setAppStatus('loading'));
  dispatch(changeTodolistEntityStatusAC(todolistID, 'loading'));
  todolistApi.deleteTodolist(todolistID)
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(removeTodolistAC(todolistID));
        dispatch(setAppStatus('succeeded'));
      } else {
        handleServerAppError(dispatch, res.data);
      }
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response ? e.response.data.message : e.message;
      dispatch(changeTodolistEntityStatusAC(todolistID, 'idle'));
      handleServerNetworkError(dispatch, error);
    });
};

// types

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TTodolistApi & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

type ActionsType =
  | RemoveTodolistACType
  | AddTodolistACType
  | ChangeTodolistTitleACType
  | ChangeFilterACType
  | SetTodoListsACType
  | SetStatusType
  | ChangeTodolistEntityStatusACType

export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
export type AddTodolistACType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeFilterACType = ReturnType<typeof changeFilterAC>
export type SetTodoListsACType = ReturnType<typeof setTodoListsAC>
export type ChangeTodolistEntityStatusACType = ReturnType<typeof changeTodolistEntityStatusAC>

