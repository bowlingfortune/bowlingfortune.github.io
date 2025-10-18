import { parseGame, calculatePermutationStats } from './src/bowling';

function randomRoll(max: number): number {
  return Math.floor(Math.random() * (max + 1));
}

function generateRandomGame(): string {
  const frames: string[] = [];

  // Frames 1-9
  for (let i = 0; i < 9; i++) {
    const first = randomRoll(10);

    if (first === 10) {
      frames.push('X');
    } else {
      const second = randomRoll(10 - first);
      if (first + second === 10) {
        frames.push(`${first}/`);
      } else {
        frames.push(`${first}${second}`);
      }
    }
  }

  // Frame 10
  const first = randomRoll(10);
  if (first === 10) {
    const second = randomRoll(10);
    if (second === 10) {
      const third = randomRoll(10);
      frames.push(`X${second === 10 ? 'X' : second}${third === 10 ? 'X' : third}`);
    } else {
      const third = randomRoll(10 - second);
      frames.push(`X${second}${third === 10 - second ? '/' : third}`);
    }
  } else {
    const second = randomRoll(10 - first);
    if (first + second === 10) {
      const third = randomRoll(10);
      frames.push(`${first}/${third === 10 ? 'X' : third}`);
    } else {
      frames.push(`${first}${second}`);
    }
  }

  return frames.join(' ');
}

function hasVariety(game: string): boolean {
  const hasStrike = game.includes('X');
  const hasSpare = game.includes('/');
  const hasOpen = /\d\d/.test(game) && !/\d\//.test(game.replace(/\d\//g, ''));
  return [hasStrike, hasSpare, hasOpen].filter(Boolean).length >= 2;
}

const unluckyCandidates: Array<{ game: string; percentile: number; score: number; median: number; range: number }> = [];
const averageCandidates: Array<{ game: string; percentile: number; score: number; median: number; range: number }> = [];

const totalGames = 100;
console.log(`Generating ${totalGames} random games...\n`);

for (let i = 0; i < totalGames; i++) {
  if (i % 10 === 0) {
    console.log(`Progress: ${i}/${totalGames}...`);
  }

  const game = generateRandomGame();
  const parsed = parseGame(game);

  if (parsed.kind === 'error') continue;

  const stats = calculatePermutationStats(parsed.frames);
  const range = stats.max - stats.min;

  // Unlucky: low percentile, has variety
  if (stats.actualPercentile <= 25 && hasVariety(game)) {
    unluckyCandidates.push({
      game,
      percentile: stats.actualPercentile,
      score: stats.actualScore,
      median: stats.median,
      range
    });
  }

  // Average: percentile 45-55, has variety, good range
  if (stats.actualPercentile >= 45 && stats.actualPercentile <= 55 && hasVariety(game) && range > 20) {
    averageCandidates.push({
      game,
      percentile: stats.actualPercentile,
      score: stats.actualScore,
      median: stats.median,
      range
    });
  }
}

console.log('=== UNLUCKY CANDIDATES (lowest percentile) ===');
unluckyCandidates
  .sort((a, b) => a.percentile - b.percentile)
  .slice(0, 10)
  .forEach(c => {
    console.log(`${c.game}`);
    console.log(`  Percentile: ${c.percentile}%, Score: ${c.score}, Median: ${c.median}, Range: ${c.range}\n`);
  });

console.log('\n=== AVERAGE CANDIDATES (closest to 50th percentile, best range) ===');
averageCandidates
  .sort((a, b) => {
    const aDist = Math.abs(50 - a.percentile);
    const bDist = Math.abs(50 - b.percentile);
    if (aDist !== bDist) return aDist - bDist;
    return b.range - a.range; // Prefer higher range
  })
  .slice(0, 10)
  .forEach(c => {
    console.log(`${c.game}`);
    console.log(`  Percentile: ${c.percentile}%, Score: ${c.score}, Median: ${c.median}, Range: ${c.range}\n`);
  });
