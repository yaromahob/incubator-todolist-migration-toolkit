export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
  isInitialized: false,
  status: 'idle' as RequestStatusType,
  error: null as null | string,
  entityStatus: 'idle',
};

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType) => {
  switch (action.type) {
    case 'APP/SET-STATUS': {
      return {...state, status: action.status};
    }
    case 'APP/SET-ERROR': {
      return {...state, error: action.error};
    }
    case "APP/SET-INITIALIZED": {
      return {...state, isInitialized: action.value};
    }
    default: {
      return state;
    }
  }
};

export const setInitialized = (value: boolean) => ({type: 'APP/SET-INITIALIZED', value} as const);

export const setAppStatus = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const);

export const setAppError = (error: null | string) => ({type: 'APP/SET-ERROR', error} as const);

export type SetStatusType = ReturnType<typeof setAppStatus>
export type SetErrorType = ReturnType<typeof setAppError>
export type SetInitialized = ReturnType<typeof setInitialized>

export type AppActionsType = SetStatusType | SetErrorType | SetInitialized