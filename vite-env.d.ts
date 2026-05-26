/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_TOKEN?: string;
  readonly VITE_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  Buffer?: typeof import('buffer').Buffer;
  process?: NodeJS.Process;
}
