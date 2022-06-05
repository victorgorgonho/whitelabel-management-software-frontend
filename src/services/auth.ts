/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const userAuth = {
  token:
    localStorage.getItem(
      String(process.env.REACT_APP_LOCAL_STORAGE_USER_AUTH),
    ) || '',
  id:
    localStorage.getItem(String(process.env.REACT_APP_LOCAL_STORAGE_USER_ID)) ||
    '',
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
