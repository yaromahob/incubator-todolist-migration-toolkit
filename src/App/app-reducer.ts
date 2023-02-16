import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
  isInitialized: false,
  status: 'idle' as RequestStatusType,
  error: null as null | string,
  entityStatus: 'idle',
};


const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setInitialized(state, action: PayloadAction<{ value: boolean }>) {
      state.isInitialized = action.payload.value;
    },
    setAppStatus(state, action: PayloadAction<{ value: RequestStatusType }>) {
      state.status = action.payload.value;
    },
    setAppError(state, action: PayloadAction<{ error: null | string }>) {
      state.error = action.payload.error;
    }
  }
});


export const appReducer = appSlice.reducer;
export const {setInitialized, setAppStatus, setAppError} = appSlice.actions;
