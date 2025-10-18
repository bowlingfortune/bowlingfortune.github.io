import { parseGame, scoreGame, calculatePermutationStats } from './src/bowling.ts';

const game = '81 X 9/ 8/ X 8/ X 81 9- XX9';
const result = parseGame(game);

if (result.kind === 'error') {
  console.error('Parse error:', result.message);
  process.exit(1);
}

const actualScore = scoreGame(result.frames);
console.log('Actual score:', actualScore);

const stats = calculatePermutationStats(result.frames);
console.log('Min:', stats.min);
console.log('Max:', stats.max);
console.log('Mean:', stats.mean);
console.log('Median:', stats.median);
console.log('Mode:', stats.mode);
console.log('Permutations:', stats.permutationCount);
console.log('Percentile:', stats.actualPercentile);
console.log('Z-score:', stats.zScore);
