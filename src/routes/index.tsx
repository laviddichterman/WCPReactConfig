import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/home';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';
import { useAuth0 } from '@auth0/auth0-react';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = useAuth0();

  const isDashboard = pathname.includes('/dashboard') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    // Dashboard Routes
    {
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'orders', element: <GeneralOrders /> },
        { path: 'timing', element: <GeneralTiming /> },
        { path: 'credit', element: <GeneralCredit /> },
        { path: 'catalog', element: <GeneralCatalog /> },
        { path: 'settings', element: <GeneralSettings /> },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfile /> },
          ],
        },
        { path: 'permission-denied', element: <PermissionDenied /> },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to={'/404'} replace /> },
      ],
    },
    {
      path: '/',
      element: (
        <GuestGuard>
          <MainLayout />
        </GuestGuard>),
      children: [
        { element: <HomePage />, index: true }
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// DASHBOARD

// GENERAL
const GeneralOrders = Loadable(lazy(() => import('../pages/dashboard/GeneralOrders')));
const GeneralTiming = Loadable(lazy(() => import('../pages/dashboard/GeneralTiming')));
const GeneralCredit = Loadable(lazy(() => import('../pages/dashboard/GeneralCredit')));
const GeneralCatalog = Loadable(lazy(() => import('../pages/dashboard/GeneralCatalog')));
const GeneralSettings = Loadable(lazy(() => import('../pages/dashboard/GeneralSettings')));

// USER
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));
// const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
// const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
// const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
// const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));

//const Login = Loadable(lazy(() => import('../pages/auth/Login')));

// MAIN
const HomePage = Loadable(lazy(() => import('../pages/Home')));


// TEST RENDER PAGE BY ROLE
const PermissionDenied = Loadable(lazy(() => import('../pages/dashboard/PermissionDenied')));

// MAIN
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));
