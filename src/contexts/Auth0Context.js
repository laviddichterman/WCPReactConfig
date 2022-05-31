import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useAuth0 } from '@auth0/auth0-react';
// routes
import { PATH_AUTH } from '../routes/paths';

// ----------------------------------------------------------------------


const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return { ...state, isAuthenticated, isInitialized: true, user };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;
    return { ...state, isAuthenticated: true, user };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'auth0',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isLoading, user, isAuthenticated, getAccessTokenSilently, loginWithPopup, logout} = useAuth0();

  useEffect(() => {
    const initialize = async () => {
      try {
        dispatch({
          type: 'INITIALIZE',
          payload: { isAuthenticated, user },
        });
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: { isAuthenticated: false, user: null },
        });
      }
    };

    if (!isLoading && isAuthenticated) {
      getAccessTokenSilently();
      initialize();
    }
    if (!isLoading && !isAuthenticated) {
      dispatch({
        type: 'INITIALIZE',
        payload: { isAuthenticated, user: null },
      });
      loginWithPopup();
    }

  }, [isLoading, getAccessTokenSilently, loginWithPopup, user, isAuthenticated]);

  const login = async () => {
    await loginWithPopup();

    if (isAuthenticated) {
      dispatch({ type: 'LOGIN', payload: { user } });
    }
  };

  const logoutLocal = () => {
    logout();
    window.location.href = PATH_AUTH.login;
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'auth0',
        user: {
          id: state?.user?.sub,
          photoURL: state?.user?.picture,
          email: state?.user?.email,
          displayName: state?.user?.name,
          role: 'admin',
        },
        login,
        logout: logoutLocal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
