import { describe, it, expect } from 'vitest';
import { Differ } from '../differ.js';

describe('Differ', () => {
  it('detects identical objects', () => {
    const differ = new Differ();
    const obj = { name: 'test', count: 42 };
    const result = differ.compare(obj, obj);
    
    expect(result.summary.identical).toBe(true);
    expect(result.differences).toHaveLength(0);
  });

  it('detects added fields', () => {
    const differ = new Differ();
    const old = { name: 'test' };
    const newObj = { name: 'test', age: 30 };
    const result = differ.compare(old, newObj);
    
    expect(result.summary.added).toBe(1);
    expect(result.differences[0]).toMatchObject({
      path: 'age',
      type: 'added',
      newValue: 30
    });
  });

  it('detects removed fields', () => {
    const differ = new Differ();
    const old = { name: 'test', age: 30 };
    const newObj = { name: 'test' };
    const result = differ.compare(old, newObj);
    
    expect(result.summary.removed).toBe(1);
    expect(result.differences[0]).toMatchObject({
      path: 'age',
      type: 'removed',
      oldValue: 30
    });
  });

  it('detects changed values', () => {
    const differ = new Differ();
    const old = { count: 10 };
    const newObj = { count: 20 };
    const result = differ.compare(old, newObj);
    
    expect(result.summary.changed).toBe(1);
    expect(result.differences[0]).toMatchObject({
      path: 'count',
      type: 'changed',
      oldValue: 10,
      newValue: 20
    });
  });

  it('detects type changes', () => {
    const differ = new Differ();
    const old = { value: '42' };
    const newObj = { value: 42 };
    const result = differ.compare(old, newObj);
    
    expect(result.summary.typeChanged).toBe(1);
    expect(result.differences[0]).toMatchObject({
      path: 'value',
      type: 'type-changed',
      oldType: 'string',
      newType: 'number'
    });
  });

  it('handles nested objects', () => {
    const differ = new Differ();
    const old = { user: { name: 'Alice', age: 25 } };
    const newObj = { user: { name: 'Bob', age: 25 } };
    const result = differ.compare(old, newObj);
    
    expect(result.differences[0].path).toBe('user.name');
    expect(result.differences[0].type).toBe('changed');
  });

  it('handles arrays', () => {
    const differ = new Differ();
    const old = { items: [1, 2, 3] };
    const newObj = { items: [1, 2, 3, 4] };
    const result = differ.compare(old, newObj);
    
    expect(result.summary.added).toBe(1);
    expect(result.differences[0].path).toBe('items[3]');
  });

  it('ignores specified paths', () => {
    const differ = new Differ({ ignorePaths: ['user.id', 'timestamp'] });
    const old = { user: { id: 1, name: 'Alice' }, timestamp: 100 };
    const newObj = { user: { id: 2, name: 'Alice' }, timestamp: 200 };
    const result = differ.compare(old, newObj);
    
    expect(result.summary.identical).toBe(true);
  });

  it('handles null and undefined', () => {
    const differ = new Differ();
    const old = { a: null, b: undefined };
    const newObj = { a: undefined, b: null };
    const result = differ.compare(old, newObj);
    
    expect(result.differences.length).toBeGreaterThan(0);
  });

  it('generates correct summary statistics', () => {
    const differ = new Differ();
    const old = { a: 1, b: 2, c: 'text' };
    const newObj = { a: 1, b: 3, d: true };
    const result = differ.compare(old, newObj);
    
    expect(result.summary.total).toBe(3);
    expect(result.summary.changed).toBe(1);
    expect(result.summary.removed).toBe(1);
    expect(result.summary.added).toBe(1);
  });
});
