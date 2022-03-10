/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { environment } from '../environment/environment';

const {
  REACT_APP_LOCAL_STORAGE_USER_AUTH,
  REACT_APP_LOCAL_STORAGE_USER_ID,
} = environment;

const userAuth = {
  token: localStorage.getItem(REACT_APP_LOCAL_STORAGE_USER_AUTH) || '',
  id: localStorage.getItem(REACT_APP_LOCAL_STORAGE_USER_ID) || '',
};

export const isAuthenticated = () => {
  // userAuth.token = String(
  //   JSON.parse(userAuth.token),
  // );
  if (userAuth.token !== '') {
    return true;
  }
  return false;
};

export const getToken = () => {
  // userAuth.token = String(JSON.parse(userAuth.token));
  if (userAuth.token !== '') {
    return userAuth.token;
  }
  return '';
};

export const getIdLoggedUser = () => {
  if (userAuth.id !== '') {
    return userAuth.id;
  }
  return '';
};
