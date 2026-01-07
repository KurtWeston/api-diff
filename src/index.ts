#!/usr/bin/env node
import { program } from 'commander';
import { readFile } from 'fs/promises';
import { log } from '@onamfc/developer-log';
import { Differ } from './differ.js';
import { Formatter } from './formatter.js';
import type { DiffOptions } from './types.js';

async function fetchJson(source: string): Promise<unknown> {
  if (source.startsWith('http://') || source.startsWith('https://')) {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  }
  
  const content = await readFile(source, 'utf-8');
  return JSON.parse(content);
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf-8');
}

program
  .name('api-diff')
  .description('Compare JSON API responses to detect structural changes')
  .version('1.0.0')
  .argument('[old]', 'Old JSON file or URL')
  .argument('[new]', 'New JSON file or URL')
  .option('-i, --ignore <paths...>', 'Paths to ignore (e.g., user.id metadata.timestamp)')
  .option('-f, --format <type>', 'Output format: pretty, compact, json', 'pretty')
  .action(async (oldSource, newSource, options) => {
    try {
      let oldJson: unknown;
      let newJson: unknown;

      if (!oldSource || !newSource) {
        const stdin = await readStdin();
        const parts = stdin.split('\n---\n');
        if (parts.length !== 2) {
          log.error('When using stdin, separate old and new JSON with ---');
          process.exit(2);
        }
        oldJson = JSON.parse(parts[0]);
        newJson = JSON.parse(parts[1]);
      } else {
        oldJson = await fetchJson(oldSource);
        newJson = await fetchJson(newSource);
      }

      const diffOptions: DiffOptions = {
        ignorePaths: options.ignore || [],
        outputFormat: options.format
      };

      const differ = new Differ(diffOptions);
      const result = differ.compare(oldJson, newJson);

      const formatter = new Formatter();
      let output: string;

      switch (options.format) {
        case 'compact':
          output = formatter.formatCompact(result);
          break;
        case 'json':
          output = formatter.formatJson(result);
          break;
        default:
          output = formatter.formatPretty(result);
      }

      console.log(output);
      process.exit(result.summary.identical ? 0 : 1);
    } catch (error) {
      log.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(2);
    }
  });

program.parse();