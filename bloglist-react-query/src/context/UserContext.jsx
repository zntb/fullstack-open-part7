import { createContext, useContext, useReducer, useEffect } from 'react';

const initialUserState = null;

const USER_LOGIN = 'USER_LOGIN';
const USER_LOGOUT = 'USER_LOGOUT';

const userReducer = (state, action) => {
  switch (action.type) {
  case USER_LOGIN:
    return action.payload;
  case USER_LOGOUT:
    return null;
  default:
    return state;
  }
};

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, initialUserState);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch({ type: USER_LOGIN, payload: user });
    }
  }, []);

  const loginUser = userData => {
    dispatch({ type: USER_LOGIN, payload: userData });
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userData));
  };

  const logoutUser = () => {
    dispatch({ type: USER_LOGOUT });
    window.localStorage.removeItem('loggedBlogappUser');
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
