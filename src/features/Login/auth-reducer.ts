import {setAppStatus, setInitialized} from "../../App/app-reducer";
import {loginApi, LoginDataType} from "../../api/login-api";
import {RESULT_CODE} from "../../api/todolist-api";
import {handleServerAppError} from "../../utils/error-utils";
import axios from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const authMe = createAsyncThunk('auth/authMe', async (arg, thunkAPI) => {
  
  thunkAPI.dispatch(setAppStatus({value: 'loading'}));
  thunkAPI.dispatch(setInitialized({value: false}));
  
  try {
    
    const result = await loginApi.authMe();
    
    if (result.data.resultCode === RESULT_CODE.SUCCESS) {
      
      thunkAPI.dispatch(setLoggedInAC({value: true}));
      thunkAPI.dispatch(setAppStatus({value: 'succeeded'}));
      
    } else {
      
      handleServerAppError(thunkAPI.dispatch, result.data);
      
    }
    
    thunkAPI.dispatch(setAppStatus({value: 'failed'}));
    
  } catch (e) {
    
    if (axios.isAxiosError(e)) {
      
      const error = e.response ? e.response.data.message : e.message;
      handleServerAppError(thunkAPI.dispatch, error);
      
    }
  }
  
  thunkAPI.dispatch(setInitialized({value: true}));
  
});
export const logIn = createAsyncThunk('auth/logIn', async (data: LoginDataType, thunkAPI) => {
  
  thunkAPI.dispatch(setAppStatus({value: 'loading'}));
  
  try {
    
    const result = await loginApi.logIn(data);
    
    if (result.data.resultCode === RESULT_CODE.SUCCESS) {
      
      thunkAPI.dispatch(setAppStatus({value: 'succeeded'}));
      return {isLoggedIn: true};
      
    } else {
      
      handleServerAppError(thunkAPI.dispatch, result.data);
      thunkAPI.dispatch(setAppStatus({value: 'failed'}));
      return thunkAPI.rejectWithValue({error: result.data.messages});
      
    }
  } catch (e) {
    
    if (axios.isAxiosError(e)) {
      
      const error = e.response ? e.response.data.message : e.message;
      handleServerAppError(thunkAPI.dispatch, error);
      return thunkAPI.rejectWithValue({error});
      
    }
  }
});
export const logOut = createAsyncThunk('auth/logOut', async (arg, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({value: 'loading'}));
  
  try {
    
    const result = await loginApi.logOut();
    
    if (result.data.resultCode === RESULT_CODE.SUCCESS) {
      
      thunkAPI.dispatch(setLoggedInAC({value: false}));
      thunkAPI.dispatch(setAppStatus({value: 'succeeded'}));
      
    } else {
      
      handleServerAppError(thunkAPI.dispatch, result.data);
      
    }
    
    thunkAPI.dispatch(setAppStatus({value: 'failed'}));
    
  } catch (e) {
    
    if (axios.isAxiosError(e)) {
      
      const error = e.response ? e.response.data.message : e.message;
      handleServerAppError(thunkAPI.dispatch, error);
      
    }
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    }
  },
  extraReducers: builder => {
    builder.addCase(logIn.fulfilled, (state, action) => {
      if (action.payload) {
        state.isLoggedIn = action.payload.isLoggedIn;
      }
    });
  }
});

export const authReducer = authSlice.reducer;
export const {setLoggedInAC} = authSlice.actions;
