/// <reference types="vite/client" />

/** Injected by Vite `define` — reads version from workspace Cargo.toml at build time. */
declare const __APP_VERSION__: string;

declare module "*.css" {
  const content: string;
  export default content;
}
