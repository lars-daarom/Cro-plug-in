import { Experiment, ExperimentStatus, ExperimentType, Variant } from "./types";

export const MOCK_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp_1',
    name: 'Checkout Page - CTA Color',
    type: ExperimentType.AB,
    status: ExperimentStatus.RUNNING,
    url: 'https://myshop.com/checkout',
    startDate: '2023-10-01',
    variants: [
      { id: 'v1_1', name: 'Control (Blue)', visitors: 1250, conversions: 45, weight: 50, isControl: true },
      { id: 'v1_2', name: 'Variant B (Green)', visitors: 1240, conversions: 78, weight: 50, isControl: false },
    ],
    targeting: [
      { id: 't1', category: 'Device', attribute: 'Type', operator: 'equals', value: 'Mobile' }
    ]
  },
  {
    id: 'exp_2',
    name: 'Homepage Hero Headline',
    type: ExperimentType.MVT,
    status: ExperimentStatus.COMPLETED,
    url: 'https://myshop.com/',
    startDate: '2023-09-15',
    variants: [
      { id: 'v2_1', name: 'Original', visitors: 5000, conversions: 120, weight: 33, isControl: true },
      { id: 'v2_2', name: 'Headline A', visitors: 4950, conversions: 135, weight: 33, isControl: false },
      { id: 'v2_3', name: 'Headline B', visitors: 4980, conversions: 110, weight: 34, isControl: false },
    ],
    targeting: []
  },
  {
    id: 'exp_3',
    name: 'Product Page Layout v2',
    type: ExperimentType.SPLIT,
    status: ExperimentStatus.DRAFT,
    url: 'https://myshop.com/product/sunglasses',
    variants: [
      { id: 'v3_1', name: 'Original URL', visitors: 0, conversions: 0, weight: 50, isControl: true },
      { id: 'v3_2', name: 'New Layout URL', visitors: 0, conversions: 0, weight: 50, isControl: false },
    ],
    targeting: [
       { id: 't2', category: 'WooCommerce', attribute: 'Total Spent', operator: 'greater_than', value: '100' }
    ]
  }
];

export const TARGETING_CATEGORIES = ['Device', 'Browser', 'URL', 'WooCommerce', 'UTM', 'Geo'];
export const OPERATORS = ['equals', 'contains', 'not_equals', 'greater_than', 'less_than', 'starts_with'];