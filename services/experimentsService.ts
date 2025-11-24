import { Experiment, ExperimentStatus, ExperimentType, TargetingRule } from '../types';
import { getRestNonce, getRestUrl } from '../plugin-config';

export interface NewVariantInput {
  name: string;
  visitors: number;
  conversions: number;
  weight: number;
  isControl: boolean;
}

export interface NewExperimentInput {
  name: string;
  type: ExperimentType;
  url: string;
  status?: ExperimentStatus;
  variants: NewVariantInput[];
  targeting: TargetingRule[];
  startDate?: string;
}

const getHeaders = () => {
  const nonce = getRestNonce();
  return {
    'Content-Type': 'application/json',
    ...(nonce ? { 'X-WP-Nonce': nonce } : {}),
  } as Record<string, string>;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return response.json();
};

export const fetchExperiments = async (): Promise<Experiment[]> => {
  const restUrl = getRestUrl();
  if (!restUrl) {
    throw new Error('REST API configuration missing');
  }

  const response = await fetch(`${restUrl}/experiments`, {
    headers: getHeaders(),
    credentials: 'include',
  });

  return handleResponse(response);
};

export const createExperiment = async (
  experiment: NewExperimentInput
): Promise<Experiment> => {
  const restUrl = getRestUrl();
  if (!restUrl) {
    throw new Error('REST API configuration missing');
  }

  const response = await fetch(`${restUrl}/experiments`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(experiment),
  });

  return handleResponse(response);
};
