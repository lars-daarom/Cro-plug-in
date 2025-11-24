import { CroPluginConfig } from './plugin-config';

declare global {
  interface Window {
    croPluginConfig?: CroPluginConfig;
  }
}

export {};
