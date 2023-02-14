import {Dispatch} from "redux";
import {AppActionsType, setAppError, SetErrorType, setAppStatus} from "../App/app-reducer";
import {ResponseType} from "../api/todolist-api";

export const handleServerNetworkError = (dispatch: Dispatch<AppActionsType>, error: string) => {
  dispatch(setAppError(error));
  dispatch(setAppStatus('failed'));
};

export const handleServerAppError = <T>(dispatch: Dispatch<SetErrorType>, data: ResponseType<T>) => {
  if (data.messages.length) {
    dispatch(setAppError(data.messages[0]));
  } else {
    dispatch(setAppError('Some Error'));
  }
};