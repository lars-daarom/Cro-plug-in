export interface CroPluginConfig {
  apiKey?: string;
  rootId?: string;
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
