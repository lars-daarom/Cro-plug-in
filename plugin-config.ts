export interface CroPluginConfig {
  apiKey?: string;
  rootId?: string;
  restUrl?: string;
  restNonce?: string;
}

const DEFAULT_ROOT_ID = 'cro-plugin-root';

type GlobalConfig = typeof window & { croPluginConfig?: CroPluginConfig };

const getGlobalConfig = (): CroPluginConfig | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return (window as GlobalConfig).croPluginConfig;
};

export const getRootElementId = (): string => {
  return getGlobalConfig()?.rootId || DEFAULT_ROOT_ID;
};

export const getApiKey = (): string | undefined => {
  return getGlobalConfig()?.apiKey || process.env.API_KEY;
};

export const getRestUrl = (): string | undefined => {
  return getGlobalConfig()?.restUrl;
};

export const getRestNonce = (): string | undefined => {
  return getGlobalConfig()?.restNonce;
};
