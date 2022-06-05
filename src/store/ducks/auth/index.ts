import { Reducer } from 'redux';
import { AuthTypes, AuthState } from './types';

const token = localStorage.getItem(
  String(process.env.REACT_APP_LOCAL_STORAGE_USER_AUTH),
);

const INITIAL_STATE: AuthState = {
  isAuthenticated: token,
};

const reducer: Reducer<AuthState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AuthTypes.LOGIN:
      return { ...state, isAuthenticated: true };
    case AuthTypes.LOGOUT:
      localStorage.removeItem(
        String(process.env.REACT_APP_LOCAL_STORAGE_USER_AUTH),
      );

      return { ...state, isAuthenticated: false };

    default:
      return state;
  }
};

export default reducer;
