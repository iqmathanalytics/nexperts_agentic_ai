/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GSHEET_WEBHOOK_URL?: string;
  /** Optional: full origin of deployed site when testing checkout from another dev port, e.g. https://preview.pages.dev */
  readonly VITE_CHECKOUT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
