import { describe, it, expect } from 'vitest';
import { Formatter } from '../src/formatter.js';
import type { CompareResult } from '../src/types.js';

describe('Formatter', () => {
  const formatter = new Formatter();

  it('formats identical results', () => {
    const result: CompareResult = {
      differences: [],
      summary: { total: 0, added: 0, removed: 0, changed: 0, typeChanged: 0, identical: true }
    };
    const output = formatter.formatPretty(result);
    expect(output).toContain('identical');
  });

  it('formats compact output', () => {
    const result: CompareResult = {
      differences: [{ path: 'user.name', type: 'changed', oldValue: 'John', newValue: 'Jane' }],
      summary: { total: 1, added: 0, removed: 0, changed: 1, typeChanged: 0, identical: false }
    };
    const output = formatter.formatCompact(result);
    expect(output).toContain('user.name');
  });

  it('formats JSON output', () => {
    const result: CompareResult = {
      differences: [{ path: 'a', type: 'added', newValue: 1 }],
      summary: { total: 1, added: 1, removed: 0, changed: 0, typeChanged: 0, identical: false }
    };
    const output = formatter.formatJson(result);
    const parsed = JSON.parse(output);
    expect(parsed.differences).toHaveLength(1);
  });

  it('includes summary in pretty format', () => {
    const result: CompareResult = {
      differences: [{ path: 'x', type: 'added', newValue: 1 }],
      summary: { total: 1, added: 1, removed: 0, changed: 0, typeChanged: 0, identical: false }
    };
    const output = formatter.formatPretty(result);
    expect(output).toContain('Summary');
    expect(output).toContain('Total changes: 1');
  });
});