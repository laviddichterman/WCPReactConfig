import { useContext } from 'react';
//
import { AuthContext, Auth0Context } from '../contexts/Auth0Context';

// ----------------------------------------------------------------------

const useAuth = () => {
  const context = useContext<AuthContext>(Auth0Context);

  if (!context) throw new Error('Auth context must be use inside AuthProvider');

  return context;
};

export default useAuth;
