import { Reducer } from 'redux';
import { AuthTypes, AuthState } from './types';
import { environment } from '../../../environment/environment';

const token = localStorage.getItem(
  environment.REACT_APP_LOCAL_STORAGE_USER_AUTH,
);

const INITIAL_STATE: AuthState = {
  isAuthenticated: token,
};

const reducer: Reducer<AuthState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AuthTypes.LOGIN:
      return { ...state, isAuthenticated: true };
    case AuthTypes.LOGOUT:
      localStorage.removeItem(environment.REACT_APP_LOCAL_STORAGE_USER_AUTH);

      return { ...state, isAuthenticated: false };

    default:
      return state;
  }
};

export default reducer;
