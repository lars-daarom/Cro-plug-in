export enum ExperimentType {
  AB = 'A/B Test',
  SPLIT = 'Split URL',
  MVT = 'Multivariate',
}

export enum ExperimentStatus {
  DRAFT = 'Draft',
  RUNNING = 'Running',
  PAUSED = 'Paused',
  COMPLETED = 'Completed',
}

export interface Variant {
  id: string;
  name: string;
  visitors: number;
  conversions: number;
  weight: number; // 0-100
  isControl: boolean;
}

export interface TargetingRule {
  id: string;
  category: 'Device' | 'Browser' | 'URL' | 'WooCommerce' | 'UTM';
  attribute: string;
  operator: 'equals' | 'contains' | 'not_equals' | 'greater_than';
  value: string;
}

export interface Experiment {
  id: string;
  name: string;
  type: ExperimentType;
  status: ExperimentStatus;
  url: string;
  startDate?: string;
  variants: Variant[];
  targeting: TargetingRule[];
}

export interface StatsAnalysis {
  variantId: string;
  conversionRate: number;
  improvement: number; // Percentage
  significance: number; // Probability to beat control (0-100)
  isWinner: boolean;
}