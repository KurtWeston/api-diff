export type ChangeType = 'added' | 'removed' | 'changed' | 'type-changed';

export interface DiffResult {
  path: string;
  type: ChangeType;
  oldValue?: unknown;
  newValue?: unknown;
  oldType?: string;
  newType?: string;
}

export interface DiffSummary {
  total: number;
  added: number;
  removed: number;
  changed: number;
  typeChanged: number;
  identical: boolean;
}

export interface DiffOptions {
  ignorePaths?: string[];
  outputFormat?: 'pretty' | 'compact' | 'json';
}

export interface CompareResult {
  differences: DiffResult[];
  summary: DiffSummary;
}