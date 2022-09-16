import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import LoadingScreen from '../components/LoadingScreen';
import { useAuth0 } from '@auth0/auth0-react';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth0();
  if (isAuthenticated) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
