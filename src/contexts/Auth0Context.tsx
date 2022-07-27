import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { useAuth0, User } from '@auth0/auth0-react';
// routes
import { PATH_AUTH } from '../routes/paths';

// ----------------------------------------------------------------------

type AuthUser = User | undefined;
export type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
};

export type AuthContext = {  method: 'auth0';
login: () => Promise<void>;
logout: VoidFunction; } & AuthState;

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: undefined,
};

enum Types {
  init = 'INITIALIZE',
  login = 'LOGIN',
  logout = 'LOGOUT',
}

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

type Auth0AuthPayload = {
  [Types.init]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.login]: {
    user: AuthUser;
  };
  [Types.logout]: undefined;
};

type Auth0Actions = ActionMap<Auth0AuthPayload>[keyof ActionMap<Auth0AuthPayload>];

const reducer = (state: AuthState, action: Auth0Actions) => {
  if (action.type === Types.init) {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }
  if (action.type === Types.login) {
    const { user } = action.payload;
    return { ...state, isAuthenticated: true, user };
  }
  if (action.type === Types.logout) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

const Auth0Context = createContext<AuthContext>({
  ...initialState,
  method: 'auth0',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};
function AuthProvider({ children } : AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isLoading, user, isAuthenticated, getAccessTokenSilently, loginWithPopup, logout } = useAuth0();

  useEffect(() => {
    const initialize = async () => {
      try {
        dispatch({
          type: Types.init,
          payload: { isAuthenticated, user },
        });
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.init,
          payload: { isAuthenticated: false, user },
        });
      }
    };

    if (!isLoading && isAuthenticated) {
      getAccessTokenSilently();
      initialize();
    }
    if (!isLoading && !isAuthenticated) {
      loginWithPopup();
      dispatch({
        type: Types.init,
        payload: { isAuthenticated, user },
      });
      
    }

  }, [isLoading, getAccessTokenSilently, loginWithPopup, user, isAuthenticated]);

  const login = async () => {
    await loginWithPopup();

    if (isAuthenticated) {
      dispatch({ type: Types.login, payload: { user } });
    }
  };

  const logoutLocal = () => {
    logout();
    window.location.href = PATH_AUTH.login;
    dispatch({ type: Types.logout });
  };

  return (
    <Auth0Context.Provider
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
    </Auth0Context.Provider>
  );
}

export { Auth0Context, AuthProvider };
