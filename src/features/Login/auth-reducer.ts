import {Dispatch} from "redux";
import {setAppStatus, setInitialized} from "../../App/app-reducer";
import {loginApi, LoginDataType} from "../../api/login-api";
import {RESULT_CODE} from "../../api/todolist-api";
import {handleServerAppError} from "../../utils/error-utils";
import axios from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    }
  }
});

export const authReducer = authSlice.reducer;
export const {setLoggedInAC} = authSlice.actions;

// thunks

export const authMeTC = () =>
  async (dispatch: Dispatch) => {
    dispatch(setAppStatus({value: 'loading'}));
    dispatch(setInitialized({value: false}));
    try {
      const result = await loginApi.authMe();
      if (result.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(setLoggedInAC({value: true}));
        dispatch(setAppStatus({value: 'succeeded'}));
      } else {
        handleServerAppError(dispatch, result.data);
      }
      dispatch(setAppStatus({value: 'failed'}));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e.response ? e.response.data.message : e.message;
        handleServerAppError(dispatch, error);
      }
    }
    dispatch(setInitialized({value: true}));
  };

export const logInTC = (data: LoginDataType) =>
  async (dispatch: Dispatch) => {
    dispatch(setAppStatus({value: 'loading'}));
    try {
      const result = await loginApi.logIn(data);
      if (result.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(setLoggedInAC({value: true}));
        dispatch(setAppStatus({value: 'succeeded'}));
        console.log(result);
      } else {
        handleServerAppError(dispatch, result.data);
      }
      dispatch(setAppStatus({value: 'failed'}));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e.response ? e.response.data.message : e.message;
        handleServerAppError(dispatch, error);
      }
    }
  };

export const logOutTC = () =>
  async (dispatch: Dispatch) => {
    dispatch(setAppStatus({value: 'loading'}));
    try {
      const result = await loginApi.logOut();
      if (result.data.resultCode === RESULT_CODE.SUCCESS) {
        dispatch(setLoggedInAC({value: false}));
        dispatch(setAppStatus({value: 'succeeded'}));
      } else {
        handleServerAppError(dispatch, result.data);
      }
      dispatch(setAppStatus({value: 'failed'}));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e.response ? e.response.data.message : e.message;
        handleServerAppError(dispatch, error);
      }
    }
  };
