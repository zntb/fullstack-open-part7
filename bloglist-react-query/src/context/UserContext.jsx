import { createContext, useContext, useReducer } from 'react';

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

  const loginUser = userData => {
    dispatch({ type: USER_LOGIN, payload: userData });
  };

  const logoutUser = () => {
    dispatch({ type: USER_LOGOUT });
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
