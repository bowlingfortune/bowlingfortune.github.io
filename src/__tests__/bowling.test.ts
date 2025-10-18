import { describe, expect, test } from 'vitest';
import { parseGame, scoreGame, calculatePermutationStats } from '../bowling';

describe('parseGame', () => {
  test('parses a perfect game', () => {
    const result = parseGame('X X X X X X X X X XXX');
    expect(result.kind).toBe('success');
    if (result.kind === 'success') {
      expect(result.frames).toHaveLength(10);
      expect(scoreGame(result.frames)).toBe(300);
    }
  });

  test('detects too few frames', () => {
    const result = parseGame('X X X');
    expect(result.kind).toBe('error');
  });

  test('rejects invalid characters', () => {
    const result = parseGame('Q X X X X X X X X XXX');
    expect(result.kind).toBe('error');
  });

  test('rejects impossible pin counts', () => {
    const result = parseGame('99 99 99 99 99 99 99 99 99 999');
    expect(result.kind).toBe('error');
  });

  test('accepts typical mixed game', () => {
    const input = '9/ X 81 7/ X X 9- 90 X XX6';
    const result = parseGame(input);
    expect(result.kind).toBe('success');
    if (result.kind === 'success') {
      expect(scoreGame(result.frames)).toBe(190);
    }
  });
});

describe('scoreGame', () => {
  const cases: Array<{ input: string; expected: number }> = [
    { input: 'X X X X X X X X X XXX', expected: 300 },
    { input: '9- 9- 9- 9- 9- 9- 9- 9- 9- 9-', expected: 90 },
    { input: '5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/5', expected: 150 },
    { input: 'X 7/ 9- X -8 8/ -6 X X X81', expected: 167 },
    { input: '34 7/ X 9- X 9/ 72 8/ X XXX', expected: 181 },
  ];

  for (const { input, expected } of cases) {
    test(`scores ${input} as ${expected}`, () => {
      const parsed = parseGame(input);
      if (parsed.kind !== 'success') {
        throw new Error(`Failed to parse input: ${input}`);
      }
      expect(scoreGame(parsed.frames)).toBe(expected);
    });
  }
});

describe('calculatePermutationStats', () => {
  test('calculates correct median for 81 X 9/ 8/ X 8/ X 81 9- XX9', () => {
    const input = '81 X 9/ 8/ X 8/ X 81 9- XX9';
    const parsed = parseGame(input);
    if (parsed.kind !== 'success') {
      throw new Error('Failed to parse input');
    }

    const actualScore = scoreGame(parsed.frames);
    const stats = calculatePermutationStats(parsed.frames);

    expect(actualScore).toBe(173);
    expect(stats.permutationCount).toBe(362880);
    expect(stats.median).toBe(181);
    expect(stats.min).toBe(168);
    expect(stats.max).toBe(204);
  });
});
