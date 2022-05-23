import React from 'react';
import { render } from 'react-dom';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import { createBrowserHistory } from "history";
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import swConfig from './swConfig'
import reportWebVitals from './reportWebVitals';
import config from "./auth_config.json";

export const history = createBrowserHistory();

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState) => {
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname);
};

const rootElement = document.getElementById("root");
render(
  <React.StrictMode>
  <Auth0Provider
    domain={config.domain}
    clientId={config.clientId}
    redirectUri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    audience={config.audience}
    scope={"write:order_config read:settings write:settings write:catalog delete:catalog advanced:catalog edit:store_credit advanced:store_credit"}
  >
    <App />
  </Auth0Provider>
  </React.StrictMode>, rootElement
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register(swConfig);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
