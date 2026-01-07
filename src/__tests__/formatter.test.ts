import { describe, it, expect } from 'vitest';
import { Formatter } from '../formatter.js';
import type { CompareResult } from '../types.js';

describe('Formatter', () => {
  const formatter = new Formatter();

  it('formats identical results', () => {
    const result: CompareResult = {
      differences: [],
      summary: {
        total: 0,
        added: 0,
        removed: 0,
        changed: 0,
        typeChanged: 0,
        identical: true
      }
    };
    
    const output = formatter.formatPretty(result);
    expect(output).toContain('No differences');
    expect(output).toContain('identical');
  });

  it('formats added fields in pretty mode', () => {
    const result: CompareResult = {
      differences: [
        { path: 'newField', type: 'added', newValue: 'test' }
      ],
      summary: {
        total: 1,
        added: 1,
        removed: 0,
        changed: 0,
        typeChanged: 0,
        identical: false
      }
    };
    
    const output = formatter.formatPretty(result);
    expect(output).toContain('newField');
    expect(output).toContain('+');
  });

  it('formats removed fields in pretty mode', () => {
    const result: CompareResult = {
      differences: [
        { path: 'oldField', type: 'removed', oldValue: 42 }
      ],
      summary: {
        total: 1,
        added: 0,
        removed: 1,
        changed: 0,
        typeChanged: 0,
        identical: false
      }
    };
    
    const output = formatter.formatPretty(result);
    expect(output).toContain('oldField');
    expect(output).toContain('-');
  });

  it('formats type changes in pretty mode', () => {
    const result: CompareResult = {
      differences: [
        {
          path: 'field',
          type: 'type-changed',
          oldValue: '42',
          newValue: 42,
          oldType: 'string',
          newType: 'number'
        }
      ],
      summary: {
        total: 1,
        added: 0,
        removed: 0,
        changed: 0,
        typeChanged: 1,
        identical: false
      }
    };
    
    const output = formatter.formatPretty(result);
    expect(output).toContain('string');
    expect(output).toContain('number');
  });

  it('formats compact output', () => {
    const result: CompareResult = {
      differences: [
        { path: 'field1', type: 'added', newValue: 1 },
        { path: 'field2', type: 'removed', oldValue: 2 }
      ],
      summary: {
        total: 2,
        added: 1,
        removed: 1,
        changed: 0,
        typeChanged: 0,
        identical: false
      }
    };
    
    const output = formatter.formatCompact(result);
    expect(output).toContain('field1');
    expect(output).toContain('field2');
    expect(output.split('\n')).toHaveLength(2);
  });

  it('formats JSON output', () => {
    const result: CompareResult = {
      differences: [
        { path: 'test', type: 'added', newValue: 'value' }
      ],
      summary: {
        total: 1,
        added: 1,
        removed: 0,
        changed: 0,
        typeChanged: 0,
        identical: false
      }
    };
    
    const output = formatter.formatJson(result);
    const parsed = JSON.parse(output);
    expect(parsed.differences).toHaveLength(1);
    expect(parsed.summary.total).toBe(1);
  });

  it('includes summary in pretty output', () => {
    const result: CompareResult = {
      differences: [
        { path: 'a', type: 'added', newValue: 1 },
        { path: 'b', type: 'removed', oldValue: 2 },
        { path: 'c', type: 'changed', oldValue: 3, newValue: 4 }
      ],
      summary: {
        total: 3,
        added: 1,
        removed: 1,
        changed: 1,
        typeChanged: 0,
        identical: false
      }
    };
    
    const output = formatter.formatPretty(result);
    expect(output).toContain('Summary');
    expect(output).toContain('Total changes: 3');
  });
});
