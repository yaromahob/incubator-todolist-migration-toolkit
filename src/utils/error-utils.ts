import {Dispatch} from "redux";
import {setAppError, setAppStatus} from "../App/app-reducer";
import {ResponseType} from "../api/todolist-api";

export const handleServerNetworkError = (dispatch: Dispatch, error: string) => {
  dispatch(setAppError({error}));
  dispatch(setAppStatus({value: 'failed'}));
};

export const handleServerAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
  if (data.messages.length) {
    dispatch(setAppError({error: data.messages[0]}));
  } else {
    dispatch(setAppError({error: 'Some Error'}));
  }
};