// @mui
import { enUS, esES } from '@mui/material/locale';
import { SettingsValueProps } from './components/settings/type';
// routes
import { LicenseInfo } from '@mui/x-license';
import { PATH_DASHBOARD } from './routes/paths';
// API
// ----------------------------------------------------------------------

export const HOST_API = import.meta.env.VITE_HOST_API_KEY || '';

export const AUTH0_API = {
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  scope: import.meta.env.VITE_AUTH0_SCOPE,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE
};

export const SOCKETIO = {
  ns: import.meta.env.VITE_SOCKETIO_NS,
}

export const MAPBOX_API = import.meta.env.VITE_MAPBOX_API;

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_KEY);

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.general.orders;

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  MOBILE_HEIGHT: 64,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 92,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
};

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20,
};

// SETTINGS
// Please remove `localStorage` when you change settings.
// ----------------------------------------------------------------------

export const defaultSettings: SettingsValueProps = {
  themeMode: 'light',
  themeDirection: 'ltr',
  themeContrast: 'default',
  themeLayout: 'horizontal',
  themeColorPresets: 'default',
  themeStretch: false,
};

// MULTI LANGUAGES
// Please remove `localStorage` when you change settings.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: '/assets/icons/flags/ic_flag_us.svg',
  },
  {
    label: 'Español',
    value: 'es',
    systemValue: esES,
    icon: '/assets/icons/flags/ic_flag_es.svg',
  },
];

export const defaultLang = allLangs[0]; // English
