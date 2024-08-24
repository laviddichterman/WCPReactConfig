// i18n
import './locales/i18n';

// highlight
import './utils/highlight';

// slick-carousel
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import { Auth0Provider } from '@auth0/auth0-react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, useNavigate } from 'react-router-dom';
// redux
import { store } from './redux/store';
// contexts
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
import { SettingsProvider } from './contexts/SettingsContext';

//
import App from './App';

import { AUTH0_API } from './config';

const Auth0ProviderWithRedirectCallback = ({ children }: { children?: React.ReactNode; }) => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState: any) => {
    const dest = (appState && appState.returnTo) || window.location.pathname;
    console.log(dest);
    navigate((appState && appState.returnTo) || window.location.pathname);
  };
  return (
    <Auth0Provider
      onRedirectCallback={onRedirectCallback}
      domain={AUTH0_API.domain}
      clientId={AUTH0_API.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        scope: AUTH0_API.scope,
        audience: AUTH0_API.audience
      }}
    >
      {children}
    </Auth0Provider>
  );
};

// ----------------------------------------------------------------------
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(

  <HelmetProvider>

    <BrowserRouter>
      <Auth0ProviderWithRedirectCallback>
        <ReduxProvider store={store}>
          <SettingsProvider>
            <CollapseDrawerProvider>
              <App />
            </CollapseDrawerProvider>
          </SettingsProvider>
        </ReduxProvider>
      </Auth0ProviderWithRedirectCallback>
    </BrowserRouter>

  </HelmetProvider>

);