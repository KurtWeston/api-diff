import { describe, it, expect } from 'vitest';
import { Differ } from '../src/differ.js';

describe('Differ', () => {
  it('detects identical objects', () => {
    const differ = new Differ();
    const result = differ.compare({ a: 1 }, { a: 1 });
    expect(result.summary.identical).toBe(true);
    expect(result.differences).toHaveLength(0);
  });

  it('detects added fields', () => {
    const differ = new Differ();
    const result = differ.compare({ a: 1 }, { a: 1, b: 2 });
    expect(result.summary.added).toBe(1);
    expect(result.differences[0].type).toBe('added');
    expect(result.differences[0].path).toBe('b');
  });

  it('detects removed fields', () => {
    const differ = new Differ();
    const result = differ.compare({ a: 1, b: 2 }, { a: 1 });
    expect(result.summary.removed).toBe(1);
    expect(result.differences[0].type).toBe('removed');
  });

  it('detects changed values', () => {
    const differ = new Differ();
    const result = differ.compare({ a: 1 }, { a: 2 });
    expect(result.summary.changed).toBe(1);
    expect(result.differences[0].oldValue).toBe(1);
    expect(result.differences[0].newValue).toBe(2);
  });

  it('detects type changes', () => {
    const differ = new Differ();
    const result = differ.compare({ a: "1" }, { a: 1 });
    expect(result.summary.typeChanged).toBe(1);
    expect(result.differences[0].oldType).toBe('string');
    expect(result.differences[0].newType).toBe('number');
  });

  it('handles nested objects', () => {
    const differ = new Differ();
    const result = differ.compare({ user: { name: 'John' } }, { user: { name: 'Jane' } });
    expect(result.differences[0].path).toBe('user.name');
  });

  it('handles arrays', () => {
    const differ = new Differ();
    const result = differ.compare({ items: [1, 2] }, { items: [1, 3] });
    expect(result.differences[0].path).toBe('items[1]');
  });

  it('ignores specified paths', () => {
    const differ = new Differ({ ignorePaths: ['timestamp'] });
    const result = differ.compare({ timestamp: 100, data: 1 }, { timestamp: 200, data: 1 });
    expect(result.summary.identical).toBe(true);
  });

  it('distinguishes null and undefined', () => {
    const differ = new Differ();
    const result = differ.compare({ a: null }, { a: undefined });
    expect(result.summary.typeChanged).toBe(1);
  });
});