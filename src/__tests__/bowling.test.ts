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

describe('example scenarios', () => {
  test('Low Score Game - should parse successfully', () => {
    const input = '52 7- 43 8- 61 72 54 6- 81 7-';
    const result = parseGame(input);

    if (result.kind === 'error') {
      throw new Error(`Failed to parse: ${result.message} at column ${result.column}`);
    }

    expect(result.kind).toBe('success');
    expect(result.frames).toHaveLength(10);

    // Verify frame structure
    expect(result.frames[0].rolls).toHaveLength(2); // 52
    expect(result.frames[1].rolls).toHaveLength(2); // 7-
    expect(result.frames[2].rolls).toHaveLength(2); // 43
    expect(result.frames[3].rolls).toHaveLength(2); // 8-
    expect(result.frames[4].rolls).toHaveLength(2); // 61
    expect(result.frames[5].rolls).toHaveLength(2); // 72
    expect(result.frames[6].rolls).toHaveLength(2); // 54
    expect(result.frames[7].rolls).toHaveLength(2); // 6-
    expect(result.frames[8].rolls).toHaveLength(2); // 81
    expect(result.frames[9].rolls).toHaveLength(2); // 7- (10th frame, no strike or spare)

    const score = scoreGame(result.frames);
    // Score calculation: 7+7+7+8+7+9+9+6+9+7 = 76
    expect(score).toBe(76);

    // Verify stats calculation works without errors
    const stats = calculatePermutationStats(result.frames);
    expect(stats.permutationCount).toBe(362880); // 9! permutations
    expect(stats.min).toBeGreaterThan(0);
    // For a game with all open frames, all permutations yield the same score
    // This is expected - the order doesn't matter when there are no strikes or spares
    expect(stats.max).toBeGreaterThanOrEqual(stats.min);
    expect(stats.median).toBeGreaterThanOrEqual(stats.min);
    expect(stats.median).toBeLessThanOrEqual(stats.max);
    expect(stats.min).toBe(76);
    expect(stats.max).toBe(76);
    expect(stats.median).toBe(76);
  });

  test('Perfect Game (300)', () => {
    const input = 'X X X X X X X X X XXX';
    const result = parseGame(input);
    expect(result.kind).toBe('success');
    if (result.kind === 'success') {
      expect(result.frames).toHaveLength(10);
      expect(scoreGame(result.frames)).toBe(300);
    }
  });

  test('Lucky Game - should have high percentile and positive z-score', () => {
    const input = '81 72 63 54 9/ X X X X XXX';
    const result = parseGame(input);
    expect(result.kind).toBe('success');
    if (result.kind === 'success') {
      expect(result.frames).toHaveLength(10);
      const score = scoreGame(result.frames);
      expect(score).toBe(206);

      const stats = calculatePermutationStats(result.frames);
      expect(stats.actualPercentile).toBeGreaterThanOrEqual(75);
      expect(stats.zScore).toBeGreaterThan(0.5);
      expect(score).toBeGreaterThan(stats.median);
    }
  });

  test('Unlucky Game - should have low percentile and negative z-score', () => {
    const input = '9/ 8/ 7/ 6/ 5/ 4/ 3/ 2/ 1/ 9/0';
    const result = parseGame(input);
    expect(result.kind).toBe('success');
    if (result.kind === 'success') {
      expect(result.frames).toHaveLength(10);
      const score = scoreGame(result.frames);
      expect(score).toBe(145);

      const stats = calculatePermutationStats(result.frames);
      expect(stats.actualPercentile).toBeLessThanOrEqual(25);
      expect(stats.zScore).toBeLessThan(-0.5);
      expect(score).toBeLessThan(stats.median);
    }
  });

  test('Average Game - should have percentile near 50% and z-score near 0', () => {
    const input = '5/ 4/ 3/ 2/ 1/ 6/ 7/ 8/ 9/ 1/0';
    const result = parseGame(input);
    expect(result.kind).toBe('success');
    if (result.kind === 'success') {
      expect(result.frames).toHaveLength(10);
      const score = scoreGame(result.frames);
      expect(score).toBe(141);

      const stats = calculatePermutationStats(result.frames);
      expect(stats.actualPercentile).toBeGreaterThanOrEqual(40);
      expect(stats.actualPercentile).toBeLessThanOrEqual(60);
      expect(Math.abs(stats.zScore)).toBeLessThan(0.5);
    }
  });

  test('Clutch Performance', () => {
    const input = '7/ 8/ 81 9- 72 X 9/ 8- X XXX';
    const result = parseGame(input);
    expect(result.kind).toBe('success');
    if (result.kind === 'success') {
      expect(result.frames).toHaveLength(10);
      expect(scoreGame(result.frames)).toBeGreaterThan(0);
    }
  });

  test('All Spares Game', () => {
    const input = '9/ 8/ 7/ 6/ 5/ 4/ 3/ 2/ 1/ 9/9';
    const result = parseGame(input);
    expect(result.kind).toBe('success');
    if (result.kind === 'success') {
      expect(result.frames).toHaveLength(10);
      const score = scoreGame(result.frames);
      expect(score).toBe(154);
      // This game is all spares with descending bonus values, making it unlucky
      const stats = calculatePermutationStats(result.frames);
      expect(score).toBeLessThan(stats.median);
    }
  });
});

describe('edge cases', () => {
  test('all open frames result in same score for all permutations', () => {
    const input = '12 34 54 23 43 62 11 22 33 44';
    const result = parseGame(input);
    expect(result.kind).toBe('success');
    if (result.kind === 'success') {
      const stats = calculatePermutationStats(result.frames);
      // All permutations should yield the same score since there are no strikes or spares
      expect(stats.min).toBe(stats.max);
      expect(stats.median).toBe(stats.min);
      expect(stats.mean).toBe(stats.min);
      // All scores should be in the same bin
      expect(stats.histogram).toHaveLength(1);
      expect(stats.histogram[0].count).toBe(stats.permutationCount);
    }
  });

  test('single strike creates variation in scores', () => {
    const input = 'X 12 34 54 23 43 62 11 22 33';
    const result = parseGame(input);
    expect(result.kind).toBe('success');
    if (result.kind === 'success') {
      const stats = calculatePermutationStats(result.frames);
      // With one strike, permutations should yield different scores
      expect(stats.max).toBeGreaterThan(stats.min);
    }
  });

  test('single spare creates variation in scores', () => {
    const input = '1/ 12 34 54 23 43 62 11 22 33';
    const result = parseGame(input);
    expect(result.kind).toBe('success');
    if (result.kind === 'success') {
      const stats = calculatePermutationStats(result.frames);
      // With one spare, permutations should yield different scores
      expect(stats.max).toBeGreaterThan(stats.min);
    }
  });
});
