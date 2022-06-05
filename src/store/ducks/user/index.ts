import { Reducer } from 'redux';
import { UserState, UserTypes } from './types';

const token = localStorage.getItem(
  String(process.env.REACT_APP_LOCAL_STORAGE_USER),
);
const userLogin: UserState = JSON.parse(
  localStorage.getItem('userLogin') as any,
);

const INITIAL_STATE: UserState = {
  user: {
    id: '',
    email: '',
    name: '',
    phone: '',
    registration: '',
    user_type: '',
    isActive: false,
    isCompliant: false,
    createdAt: '',
  },
};

if (token) {
  INITIAL_STATE.user = userLogin.user;
}

const reducer: Reducer<UserState> = (state = INITIAL_STATE, action) => {
  const updatedUserState = state;

  switch (action.type) {
    case UserTypes.UPDATE_USER:
      updatedUserState.user = action.payload;

      return { ...state, ...updatedUserState };

    case UserTypes.REMOVE_USER:
      // remover dados do usuario e token do localstorage
      localStorage.removeItem('userLogin');
      localStorage.removeItem(String(process.env.REACT_APP_LOCAL_STORAGE_USER));
      // resetar estado do usario
      INITIAL_STATE.user = {
        id: '',
        email: '',
        name: '',
        phone: '',
        registration: '',
        user_type: '',
        isActive: false,
        isCompliant: false,
        createdAt: '',
      };

      return { ...state, ...INITIAL_STATE };

    default:
      return state;
  }
};

export default reducer;
