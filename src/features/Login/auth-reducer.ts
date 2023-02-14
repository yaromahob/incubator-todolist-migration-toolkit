import {Dispatch} from "redux";
import {SetErrorType, setAppStatus, SetStatusType, setInitialized} from "../../App/app-reducer";
import {loginApi, LoginDataType} from "../../api/login-api";
import {RESULT_CODE} from "../../api/todolist-api";
import {handleServerAppError} from "../../utils/error-utils";
import axios from "axios";

const initialState = {
  isLoggedIn: false
};

export const authReducer = (state: InitialStateType = initialState,
                            action: ActionsType): InitialStateType => {
  
  switch (action.type) {
    case "login/SET-IS-LOGGED-IN": {
      return {
        ...state,
        isLoggedIn: action.payload.value
      };
    }
    default: {
      return state;
    }
  }
};
// actions
export const setLoggedInAC = (value: boolean) => {
  return {
    type: 'login/SET-IS-LOGGED-IN',
    payload: {value}
  } as const;
};
// thunks

export const authMeTC = () =>
  async (dispatch: Dispatch) => {
    dispatch(setAppStatus('loading'));
    dispatch(setInitialized(false));
    try {
      const result = await loginApi.authMe();
      if (result.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(setLoggedInAC(true));
        dispatch(setAppStatus('succeeded'));
      } else {
        handleServerAppError(dispatch, result.data);
      }
      dispatch(setAppStatus('failed'));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e.response ? e.response.data.message : e.message;
        handleServerAppError(dispatch, error);
      }
    }
    dispatch(setInitialized(true));
  };

export const logInTC = (data: LoginDataType) =>
  async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus("loading"));
    try {
      const result = await loginApi.logIn(data);
      if (result.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(setLoggedInAC(true));
        dispatch(setAppStatus("succeeded"));
        console.log(result);
      } else {
        handleServerAppError(dispatch, result.data);
      }
      dispatch(setAppStatus('failed'));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e.response ? e.response.data.message : e.message;
        handleServerAppError(dispatch, error);
      }
    }
  };

export const logOutTC = () =>
  async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus("loading"));
    try {
      const result = await loginApi.logOut();
      if (result.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(setLoggedInAC(false));
        dispatch(setAppStatus("succeeded"));
      } else {
        handleServerAppError(dispatch, result.data);
      }
      dispatch(setAppStatus('failed'));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e.response ? e.response.data.message : e.message;
        handleServerAppError(dispatch, error);
      }
    }
  };

// types
type InitialStateType = typeof initialState

type ActionsType =
  | ReturnType<typeof setLoggedInAC>
  | SetStatusType
  | SetErrorType

