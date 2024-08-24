/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MUI_KEY: string
  readonly VITE_HOST_API_KEY: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_SCOPE: string;
  readonly VITE_AUTH0_AUDIENCE: string;
  readonly VITE_SOCKETIO_NS: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}