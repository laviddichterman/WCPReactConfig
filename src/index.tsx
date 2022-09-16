// i18n
import './locales/i18n';

// highlight
import './utils/highlight';

// scroll bar
import 'simplebar/src/simplebar.css';


// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { createBrowserHistory } from "history";
// redux
import { store } from './redux/store';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';

//
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import swConfig from './swConfig';
import reportWebVitals from './reportWebVitals';
import { AUTH0_API } from './config';

export const history = createBrowserHistory();


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
      domain={AUTH0_API.domain as string}
      clientId={AUTH0_API.clientId as string}
      redirectUri={window.location.origin}
      scope={AUTH0_API.scope}
      audience={AUTH0_API.audience}
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register(swConfig);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
