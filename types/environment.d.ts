export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      TENANT_ID: string;
      REFRESH_TOKEN: string;
    }
  }
}
