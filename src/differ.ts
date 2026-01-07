import { log } from '@onamfc/developer-log';
import type { DiffResult, DiffOptions, CompareResult, ChangeType } from './types.js';

export class Differ {
  private ignorePaths: Set<string>;

  constructor(options: DiffOptions = {}) {
    this.ignorePaths = new Set(options.ignorePaths || []);
  }

  compare(oldObj: unknown, newObj: unknown): CompareResult {
    const differences: DiffResult[] = [];
    this.deepCompare(oldObj, newObj, '', differences);
    
    const summary = {
      total: differences.length,
      added: differences.filter(d => d.type === 'added').length,
      removed: differences.filter(d => d.type === 'removed').length,
      changed: differences.filter(d => d.type === 'changed').length,
      typeChanged: differences.filter(d => d.type === 'type-changed').length,
      identical: differences.length === 0
    };

    return { differences, summary };
  }

  private deepCompare(oldVal: unknown, newVal: unknown, path: string, diffs: DiffResult[]): void {
    if (this.ignorePaths.has(path)) return;

    const oldType = this.getType(oldVal);
    const newType = this.getType(newVal);

    if (oldType !== newType) {
      diffs.push({ path, type: 'type-changed', oldValue: oldVal, newValue: newVal, oldType, newType });
      return;
    }

    if (oldType === 'object' && newType === 'object') {
      this.compareObjects(oldVal as Record<string, unknown>, newVal as Record<string, unknown>, path, diffs);
    } else if (oldType === 'array' && newType === 'array') {
      this.compareArrays(oldVal as unknown[], newVal as unknown[], path, diffs);
    } else if (!this.isEqual(oldVal, newVal)) {
      diffs.push({ path, type: 'changed', oldValue: oldVal, newValue: newVal });
    }
  }

  private compareObjects(oldObj: Record<string, unknown>, newObj: Record<string, unknown>, basePath: string, diffs: DiffResult[]): void {
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

    for (const key of allKeys) {
      const currentPath = basePath ? `${basePath}.${key}` : key;
      
      if (this.ignorePaths.has(currentPath)) continue;

      const hasOld = key in oldObj;
      const hasNew = key in newObj;

      if (!hasOld && hasNew) {
        diffs.push({ path: currentPath, type: 'added', newValue: newObj[key] });
      } else if (hasOld && !hasNew) {
        diffs.push({ path: currentPath, type: 'removed', oldValue: oldObj[key] });
      } else {
        this.deepCompare(oldObj[key], newObj[key], currentPath, diffs);
      }
    }
  }

  private compareArrays(oldArr: unknown[], newArr: unknown[], path: string, diffs: DiffResult[]): void {
    const maxLen = Math.max(oldArr.length, newArr.length);

    for (let i = 0; i < maxLen; i++) {
      const currentPath = `${path}[${i}]`;
      
      if (i >= oldArr.length) {
        diffs.push({ path: currentPath, type: 'added', newValue: newArr[i] });
      } else if (i >= newArr.length) {
        diffs.push({ path: currentPath, type: 'removed', oldValue: oldArr[i] });
      } else {
        this.deepCompare(oldArr[i], newArr[i], currentPath, diffs);
      }
    }
  }

  private getType(val: unknown): string {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  }

  private isEqual(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}