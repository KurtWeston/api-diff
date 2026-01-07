import chalk from 'chalk';
import type { CompareResult, DiffResult } from './types.js';

export class Formatter {
  formatPretty(result: CompareResult): string {
    if (result.summary.identical) {
      return chalk.green('✓ No differences found - responses are identical\n');
    }

    const lines: string[] = [chalk.bold('\nAPI Differences Detected:\n')];

    for (const diff of result.differences) {
      lines.push(this.formatDiff(diff));
    }

    lines.push(this.formatSummary(result.summary));
    return lines.join('\n');
  }

  formatCompact(result: CompareResult): string {
    if (result.summary.identical) return 'IDENTICAL';
    
    return result.differences
      .map(d => `${this.getSymbol(d.type)} ${d.path}`)
      .join('\n');
  }

  formatJson(result: CompareResult): string {
    return JSON.stringify(result, null, 2);
  }

  private formatDiff(diff: DiffResult): string {
    const symbol = this.getSymbol(diff.type);
    const color = this.getColor(diff.type);
    
    let line = `${symbol} ${chalk.bold(diff.path)}`;

    if (diff.type === 'type-changed') {
      line += ` ${chalk.gray(`(${diff.oldType} → ${diff.newType})`)}\n`;
      line += `  ${chalk.red(`- ${this.formatValue(diff.oldValue)}`)}\n`;
      line += `  ${chalk.green(`+ ${this.formatValue(diff.newValue)}`)}`;
    } else if (diff.type === 'changed') {
      line += '\n';
      line += `  ${chalk.red(`- ${this.formatValue(diff.oldValue)}`)}\n`;
      line += `  ${chalk.green(`+ ${this.formatValue(diff.newValue)}`)}`;
    } else if (diff.type === 'added') {
      line += ` ${chalk.green(this.formatValue(diff.newValue))}`;
    } else if (diff.type === 'removed') {
      line += ` ${chalk.red(this.formatValue(diff.oldValue))}`;
    }

    return color(line);
  }

  private formatSummary(summary: any): string {
    return `\n${chalk.bold('Summary:')}\n` +
      `  Total changes: ${summary.total}\n` +
      `  ${chalk.green('+')} Added: ${summary.added}\n` +
      `  ${chalk.red('-')} Removed: ${summary.removed}\n` +
      `  ${chalk.yellow('~')} Changed: ${summary.changed}\n` +
      `  ${chalk.magenta('⚠')} Type changed: ${summary.typeChanged}`;
  }

  private getSymbol(type: string): string {
    const symbols = { added: '+', removed: '-', changed: '~', 'type-changed': '⚠' };
    return symbols[type as keyof typeof symbols] || '?';
  }

  private getColor(type: string): (str: string) => string {
    const colors = { added: chalk.green, removed: chalk.red, changed: chalk.yellow, 'type-changed': chalk.magenta };
    return colors[type as keyof typeof colors] || chalk.white;
  }

  private formatValue(val: unknown): string {
    if (typeof val === 'string') return `"${val}"`;
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }
}