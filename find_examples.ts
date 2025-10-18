import { parseGame, scoreGame, calculatePermutationStats } from './src/bowling';

// Generate random bowling games with various patterns
function randomRoll(max: number): number {
  return Math.floor(Math.random() * (max + 1));
}

function generateRandomGame(): string {
  const frames: string[] = [];

  // Generate frames 1-9
  for (let i = 0; i < 9; i++) {
    const frameType = Math.random();

    if (frameType < 0.15) { // 15% strikes
      frames.push('X');
    } else if (frameType < 0.4) { // 25% spares
      const first = randomRoll(9);
      frames.push(`${first}/`);
    } else { // 60% open frames
      const first = randomRoll(9);
      const second = randomRoll(9 - first);
      const firstChar = first === 0 ? '-' : first.toString();
      const secondChar = second === 0 ? '-' : second.toString();
      frames.push(`${firstChar}${secondChar}`);
    }
  }

  // Generate 10th frame
  const firstRoll = Math.random() < 0.15 ? 'X' : randomRoll(9).toString();

  if (firstRoll === 'X') {
    const secondRoll = Math.random() < 0.15 ? 'X' : randomRoll(9).toString();
    if (secondRoll === 'X') {
      const thirdRoll = Math.random() < 0.15 ? 'X' : randomRoll(9).toString();
      frames.push(`X${secondRoll}${thirdRoll}`);
    } else {
      const secondVal = parseInt(secondRoll);
      const thirdRoll = Math.random() < 0.3 ? '/' : randomRoll(9 - secondVal).toString();
      frames.push(`X${secondRoll}${thirdRoll}`);
    }
  } else {
    const firstVal = parseInt(firstRoll);
    const isSpare = Math.random() < 0.25;
    if (isSpare) {
      const bonusRoll = Math.random() < 0.15 ? 'X' : randomRoll(9).toString();
      frames.push(`${firstRoll}/${bonusRoll}`);
    } else {
      const secondRoll = randomRoll(9 - firstVal).toString();
      frames.push(`${firstRoll}${secondRoll}`);
    }
  }

  return frames.join(' ');
}

interface GameCandidate {
  game: string;
  score: number;
  percentile: number;
  zScore: number;
  min: number;
  max: number;
  median: number;
  range: number;
  hasStrike: boolean;
  hasSpare: boolean;
  hasOpen: boolean;
  variety: number; // number of different frame types
}

function analyzeGame(gameStr: string): GameCandidate | null {
  const result = parseGame(gameStr);
  if (result.kind !== 'success') {
    return null;
  }

  const score = scoreGame(result.frames);
  const stats = calculatePermutationStats(result.frames);

  // Check for variety
  let hasStrike = false;
  let hasSpare = false;
  let hasOpen = false;

  for (let i = 0; i < 9; i++) { // Only check frames 1-9 for variety
    const frame = result.frames[i];
    if (frame.isStrike) hasStrike = true;
    else if (frame.isSpare) hasSpare = true;
    else hasOpen = true;
  }

  const variety = [hasStrike, hasSpare, hasOpen].filter(Boolean).length;

  return {
    game: gameStr,
    score,
    percentile: stats.actualPercentile,
    zScore: stats.zScore,
    min: stats.min,
    max: stats.max,
    median: stats.median,
    range: stats.max - stats.min,
    hasStrike,
    hasSpare,
    hasOpen,
    variety
  };
}

// Search for candidate games
console.log('Searching for better example games...\n');

const unluckyCandidates: GameCandidate[] = [];
const averageCandidates: GameCandidate[] = [];

const iterations = 100000;
for (let i = 0; i < iterations; i++) {
  const game = generateRandomGame();
  const candidate = analyzeGame(game);

  if (!candidate) continue;

  // Unlucky game criteria:
  // - Percentile <= 25
  // - Negative z-score
  // - Score below median
  // - Has variety (at least 2 different frame types)
  // - NOT all spares
  if (
    candidate.percentile <= 25 &&
    candidate.zScore < -0.5 &&
    candidate.score < candidate.median &&
    candidate.variety >= 2 &&
    !(candidate.hasSpare && !candidate.hasStrike && !candidate.hasOpen)
  ) {
    unluckyCandidates.push(candidate);
  }

  // Average game criteria:
  // - Percentile between 40-60%
  // - Z-score close to 0 (abs < 0.5)
  // - Has variety (ideally all 3 types)
  // - Good range of scores (more variation)
  // - NOT all spares
  if (
    candidate.percentile >= 40 &&
    candidate.percentile <= 60 &&
    Math.abs(candidate.zScore) < 0.5 &&
    candidate.variety >= 2 &&
    !(candidate.hasSpare && !candidate.hasStrike && !candidate.hasOpen)
  ) {
    averageCandidates.push(candidate);
  }

  if (i % 10000 === 0) {
    console.log(`Processed ${i} games...`);
  }
}

console.log(`\nCompleted ${iterations} iterations\n`);

// Sort and display top candidates
console.log('=== TOP UNLUCKY GAME CANDIDATES ===\n');
unluckyCandidates
  .sort((a, b) => {
    // Prefer variety, then lower percentile, then higher range
    if (a.variety !== b.variety) return b.variety - a.variety;
    if (Math.abs(a.percentile - b.percentile) > 2) return a.percentile - b.percentile;
    return b.range - a.range;
  })
  .slice(0, 10)
  .forEach((c, i) => {
    console.log(`${i + 1}. ${c.game}`);
    console.log(`   Score: ${c.score}, Percentile: ${c.percentile}%, Z-score: ${c.zScore}`);
    console.log(`   Range: ${c.min}-${c.max} (${c.range}), Median: ${c.median}`);
    console.log(`   Strike: ${c.hasStrike}, Spare: ${c.hasSpare}, Open: ${c.hasOpen}`);
    console.log('');
  });

console.log('=== TOP AVERAGE GAME CANDIDATES ===\n');
averageCandidates
  .sort((a, b) => {
    // Prefer variety (all 3 types), then larger range, then closest to 50th percentile
    if (a.variety !== b.variety) return b.variety - a.variety;
    if (Math.abs(a.range - b.range) > 5) return b.range - a.range;
    return Math.abs(a.percentile - 50) - Math.abs(b.percentile - 50);
  })
  .slice(0, 10)
  .forEach((c, i) => {
    console.log(`${i + 1}. ${c.game}`);
    console.log(`   Score: ${c.score}, Percentile: ${c.percentile}%, Z-score: ${c.zScore}`);
    console.log(`   Range: ${c.min}-${c.max} (${c.range}), Median: ${c.median}`);
    console.log(`   Strike: ${c.hasStrike}, Spare: ${c.hasSpare}, Open: ${c.hasOpen}`);
    console.log('');
  });

// Also search through some curated patterns
console.log('=== TESTING CURATED PATTERNS ===\n');

const curatedPatterns = [
  // Unlucky patterns - strikes early, spares/opens late
  'X X 9/ 8/ 7/ 6/ 5/ 4/ 3/ 2/',
  'X X X 9/ 8/ 7/ 6/ 5/ 4/ 3/',
  'X X 9/ 8/ 7/ 6- 5- 4- 3- 2-',
  'X 9/ 8/ 7/ 6/ 5/ 4/ 3/ 2/ 1/',
  'X 9/ 8- 7/ 6- 5/ 4- 3/ 2- 1/',
  'X X 8/ 7- 6/ 5- 4/ 3- 2/ 1/',

  // Average patterns - mixed throughout
  'X 7/ 52 8/ 63 9/ 44 X 71 9/5',
  '9/ X 63 7/ 52 X 71 8/ 44 7/6',
  'X 8/ 71 6/ 52 9/ 43 X 62 8/5',
  '7/ 62 X 8/ 53 9/ 71 X 44 9/6',
  '8/ X 62 7/ 53 X 71 9/ 44 8/5',
  'X 7/ 63 8/ 52 9/ 71 X 44 8/6',
  '9/ 71 X 8/ 62 7/ 53 X 44 9/5',
];

for (const pattern of curatedPatterns) {
  const candidate = analyzeGame(pattern);
  if (candidate) {
    console.log(`${pattern}`);
    console.log(`   Score: ${candidate.score}, Percentile: ${candidate.percentile}%, Z-score: ${candidate.zScore}`);
    console.log(`   Range: ${candidate.min}-${candidate.max} (${candidate.range}), Median: ${candidate.median}`);
    console.log(`   Strike: ${candidate.hasStrike}, Spare: ${candidate.hasSpare}, Open: ${candidate.hasOpen}`);
    console.log('');
  }
}
