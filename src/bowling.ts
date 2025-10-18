export interface Roll {
  value: number;
  symbol: string;
  column: number;
}

export interface Frame {
  rolls: Roll[];
  isStrike: boolean;
  isSpare: boolean;
}

export interface ParseSuccess {
  kind: 'success';
  frames: Frame[];
}

export interface ParseError {
  kind: 'error';
  message: string;
  column: number;
}

export type ParseResult = ParseSuccess | ParseError;

const SEPARATORS = new Set([' ', '\t', ',', ';']);

const VALID_FIRST_ROLL = new Set('0123456789-'.split(''));
const VALID_FILL_ROLL = new Set('0123456789-X/'.split(''));

type RollReaderContext = {
  line: string;
  index: number;
};

function isSeparator(char: string): boolean {
  return SEPARATORS.has(char);
}

function readNextNonSeparator(ctx: RollReaderContext): { char: string; column: number } | null {
  const { line } = ctx;
  while (ctx.index < line.length && isSeparator(line[ctx.index]!)) {
    ctx.index += 1;
  }
  if (ctx.index >= line.length) {
    return null;
  }
  const column = ctx.index + 1;
  const char = line[ctx.index]!.toUpperCase();
  ctx.index += 1;
  return { char, column };
}

function charToValue(char: string): number {
  if (char === 'X') {
    return 10;
  }
  if (char === '-') {
    return 0;
  }
  const parsed = Number.parseInt(char, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid roll symbol '${char}'`);
  }
  if (parsed < 0 || parsed > 9) {
    throw new Error(`Invalid roll value '${char}'`);
  }
  return parsed;
}

function validateFirstBall(char: string): boolean {
  return char === 'X' || VALID_FIRST_ROLL.has(char);
}

function validateFillBall(char: string): boolean {
  return VALID_FILL_ROLL.has(char);
}

function createRoll(symbol: string, value: number, column: number): Roll {
  return { symbol, value, column };
}

export function parseGame(line: string): ParseResult {
  const frames: Frame[] = [];
  const ctx: RollReaderContext = { line, index: 0 };

  const consumeFrameSeparator = () => {
    while (ctx.index < line.length && isSeparator(line[ctx.index]!)) {
      ctx.index += 1;
    }
  };

  for (let frameIndex = 0; frameIndex < 9; frameIndex += 1) {
    consumeFrameSeparator();
    if (ctx.index >= line.length) {
      return {
        kind: 'error',
        message: `Expected frame ${frameIndex + 1}, but the line ended early`,
        column: line.length + 1,
      };
    }
    const firstRaw = readNextNonSeparator(ctx);
    if (!firstRaw) {
      return {
        kind: 'error',
        message: `Expected frame ${frameIndex + 1}, but found nothing`,
        column: line.length + 1,
      };
    }
    const { char: firstChar, column: firstColumn } = firstRaw;

    if (!validateFirstBall(firstChar)) {
      return {
        kind: 'error',
        message: `Invalid roll '${firstChar}' in frame ${frameIndex + 1}`,
        column: firstColumn,
      };
    }

    if (firstChar === 'X') {
      frames.push({
        rolls: [createRoll('X', 10, firstColumn)],
        isStrike: true,
        isSpare: false,
      });
      continue;
    }

    const firstValue = charToValue(firstChar);
    const secondRaw = readNextNonSeparator(ctx);
    if (!secondRaw) {
      return {
        kind: 'error',
        message: `Frame ${frameIndex + 1} is missing a second roll`,
        column: line.length + 1,
      };
    }
    const { char: secondChar, column: secondColumn } = secondRaw;

    if (secondChar === 'X') {
      return {
        kind: 'error',
        message: `Strike symbol not allowed in second roll of frame ${frameIndex + 1}`,
        column: secondColumn,
      };
    }

    if (secondChar === '/') {
      if (firstValue >= 10) {
        return {
          kind: 'error',
          message: `Spare in frame ${frameIndex + 1} requires the first roll to be less than 10`,
          column: secondColumn,
        };
      }
      const secondValue = 10 - firstValue;
      frames.push({
        rolls: [
          createRoll(firstChar, firstValue, firstColumn),
          createRoll('/', secondValue, secondColumn),
        ],
        isStrike: false,
        isSpare: true,
      });
      continue;
    }

    if (!VALID_FIRST_ROLL.has(secondChar)) {
      return {
        kind: 'error',
        message: `Invalid roll '${secondChar}' in frame ${frameIndex + 1}`,
        column: secondColumn,
      };
    }

    const secondValue = charToValue(secondChar);
    if (firstValue + secondValue > 10) {
      return {
        kind: 'error',
        message: `Pins knocked down exceed 10 in frame ${frameIndex + 1}`,
        column: secondColumn,
      };
    }

    frames.push({
      rolls: [
        createRoll(firstChar, firstValue, firstColumn),
        createRoll(secondChar, secondValue, secondColumn),
      ],
      isStrike: false,
      isSpare: false,
    });
  }

  consumeFrameSeparator();
  if (ctx.index >= line.length) {
    return {
      kind: 'error',
      message: 'Frame 10 is missing',
      column: line.length + 1,
    };
  }

  const tenthFrame = parseTenthFrame(ctx, line);
  if (tenthFrame.kind === 'error') {
    return tenthFrame;
  }
  frames.push(tenthFrame.frame);

  consumeFrameSeparator();
  if (ctx.index < line.length) {
    const column = ctx.index + 1;
    return {
      kind: 'error',
      message: 'Too many rolls provided. Expected exactly 10 frames.',
      column,
    };
  }

  return { kind: 'success', frames };
}

type TenthFrameResult =
  | { kind: 'success'; frame: Frame }
  | ParseError;

function parseTenthFrame(ctx: RollReaderContext, line: string): TenthFrameResult {
  const firstRaw = readNextNonSeparator(ctx);
  if (!firstRaw) {
    return {
      kind: 'error',
      message: 'Frame 10 is missing',
      column: line.length + 1,
    };
  }
  const { char: firstChar, column: firstColumn } = firstRaw;
  if (!validateFirstBall(firstChar)) {
    return {
      kind: 'error',
      message: `Invalid roll '${firstChar}' in frame 10`,
      column: firstColumn,
    };
  }

  if (firstChar === 'X') {
    return parseTenthAfterStrike(ctx, firstColumn);
  }

  const firstValue = charToValue(firstChar);
  const secondRaw = readNextNonSeparator(ctx);
  if (!secondRaw) {
    return {
      kind: 'error',
      message: 'Frame 10 is missing a second roll',
      column: line.length + 1,
    };
  }
  const { char: secondChar, column: secondColumn } = secondRaw;

  if (secondChar === 'X') {
    return {
      kind: 'error',
      message: 'Strike symbol not allowed as the second roll unless the first was a strike',
      column: secondColumn,
    };
  }

  if (secondChar === '/') {
    if (firstValue >= 10) {
      return {
        kind: 'error',
        message: 'Spare in frame 10 requires the first roll to be less than 10',
        column: secondColumn,
      };
    }
    const secondValue = 10 - firstValue;
    const thirdRaw = readNextNonSeparator(ctx);
    if (!thirdRaw) {
      return {
        kind: 'error',
        message: 'A bonus ball is required after a spare in frame 10',
        column: line.length + 1,
      };
    }
    const { char: thirdChar, column: thirdColumn } = thirdRaw;
    if (thirdChar === '/') {
      return {
        kind: 'error',
        message: 'Spare symbol cannot be used for the fill ball after a spare',
        column: thirdColumn,
      };
    }
    if (!validateFillBall(thirdChar)) {
      return {
        kind: 'error',
        message: `Invalid fill ball '${thirdChar}' in frame 10`,
        column: thirdColumn,
      };
    }
    const thirdValue = thirdChar === 'X' ? 10 : charToValue(thirdChar);
    return {
      kind: 'success',
      frame: {
        rolls: [
          createRoll(firstChar, firstValue, firstColumn),
          createRoll('/', secondValue, secondColumn),
          createRoll(thirdChar, thirdValue, thirdColumn),
        ],
        isStrike: false,
        isSpare: true,
      },
    };
  }

  if (!VALID_FIRST_ROLL.has(secondChar)) {
    return {
      kind: 'error',
      message: `Invalid roll '${secondChar}' in frame 10`,
      column: secondColumn,
    };
  }

  const secondValue = charToValue(secondChar);
  if (firstValue + secondValue > 10) {
    return {
      kind: 'error',
      message: 'Pins knocked down exceed 10 in frame 10',
      column: secondColumn,
    };
  }

  return {
    kind: 'success',
    frame: {
      rolls: [
        createRoll(firstChar, firstValue, firstColumn),
        createRoll(secondChar, secondValue, secondColumn),
      ],
      isStrike: false,
      isSpare: false,
    },
  };
}

function parseTenthAfterStrike(ctx: RollReaderContext, firstColumn: number): TenthFrameResult {
  const secondRaw = readNextNonSeparator(ctx);
  if (!secondRaw) {
    return {
      kind: 'error',
      message: 'A strike in frame 10 requires two additional rolls',
      column: firstColumn,
    };
  }
  const { char: secondChar, column: secondColumn } = secondRaw;
  if (!validateFillBall(secondChar) || secondChar === '/') {
    return {
      kind: 'error',
      message: 'Invalid second roll after a strike in frame 10',
      column: secondColumn,
    };
  }

  let secondValue: number;
  if (secondChar === 'X') {
    secondValue = 10;
  } else {
    secondValue = charToValue(secondChar);
  }

  const thirdRaw = readNextNonSeparator(ctx);
  if (!thirdRaw) {
    return {
      kind: 'error',
      message: 'A strike in frame 10 requires two additional rolls',
      column: secondColumn,
    };
  }
  const { char: thirdChar, column: thirdColumn } = thirdRaw;

  if (!validateFillBall(thirdChar)) {
    return {
      kind: 'error',
      message: `Invalid fill ball '${thirdChar}' in frame 10`,
      column: thirdColumn,
    };
  }

  let thirdValue: number;
  if (thirdChar === 'X') {
    thirdValue = 10;
  } else if (thirdChar === '/') {
    if (secondChar === 'X') {
      return {
        kind: 'error',
        message: 'Spare symbol cannot follow a strike in the second roll of frame 10',
        column: thirdColumn,
      };
    }
    if (secondValue >= 10) {
      return {
        kind: 'error',
        message: 'Spare symbol invalid because there are no pins remaining',
        column: thirdColumn,
      };
    }
    thirdValue = 10 - secondValue;
  } else {
    thirdValue = charToValue(thirdChar);
    if (secondChar !== 'X' && secondValue + thirdValue > 10) {
      return {
        kind: 'error',
        message: 'Pins knocked down exceed the remaining pins in frame 10',
        column: thirdColumn,
      };
    }
  }

  return {
    kind: 'success',
    frame: {
      rolls: [
        createRoll('X', 10, firstColumn),
        createRoll(secondChar, secondValue, secondColumn),
        createRoll(thirdChar, thirdValue, thirdColumn),
      ],
      isStrike: true,
      isSpare: false,
    },
  };
}

export function scoreGame(frames: Frame[]): number {
  const rolls: number[] = [];
  const strikeFlags: boolean[] = [];
  const spareFlags: boolean[] = [];

  for (const frame of frames) {
    for (const roll of frame.rolls) {
      rolls.push(roll.value);
    }
    strikeFlags.push(frame.isStrike);
    spareFlags.push(frame.isSpare);
  }

  let score = 0;
  let rollIndex = 0;
  for (let frameIndex = 0; frameIndex < 10; frameIndex += 1) {
    if (strikeFlags[frameIndex]) {
      score += 10 + (rolls[rollIndex + 1] ?? 0) + (rolls[rollIndex + 2] ?? 0);
      rollIndex += 1;
    } else if (spareFlags[frameIndex]) {
      score += 10 + (rolls[rollIndex + 2] ?? 0);
      rollIndex += 2;
    } else {
      score += (rolls[rollIndex] ?? 0) + (rolls[rollIndex + 1] ?? 0);
      rollIndex += 2;
    }
  }
  return score;
}

export interface PermutationStats {
  min: number;
  max: number;
  mean: number;
  median: number;
  mode: number[];
  permutationCount: number;
  histogram: HistogramBin[];
  actualPercentile: number;
  zScore: number;
  skewness: number;
  standardDeviation: number;
}

export interface HistogramBin {
  score: number;
  count: number;
  frequency: number;
}

export interface FrameScore {
  frameNumber: number;
  pinsKnocked: number;
  scoreContribution: number;
  cumulativeScore: number;
  rollSymbols: string;
  isStrike: boolean;
  isSpare: boolean;
}

export interface FrameImpactAnalysis {
  frameNumber: number;
  actualContribution: number;
  averageContribution: number;
  positionBenefit: number;
  rollSymbols: string;
  isStrike: boolean;
  isSpare: boolean;
  explanation: string;
}

/**
 * Generate all permutations of frames 1-9 using Heap's algorithm.
 * Frame 10 is kept fixed at the end.
 */
function generatePermutations(frames: Frame[]): Frame[][] {
  if (frames.length !== 10) {
    throw new Error('Expected exactly 10 frames');
  }

  const first9 = frames.slice(0, 9);
  const frame10 = frames[9];
  const permutations: Frame[][] = [];

  function heapPermute(arr: Frame[], n: number): void {
    if (n === 1) {
      permutations.push([...arr, frame10]);
      return;
    }

    for (let i = 0; i < n; i++) {
      heapPermute(arr, n - 1);
      if (n % 2 === 0) {
        [arr[i], arr[n - 1]] = [arr[n - 1], arr[i]];
      } else {
        [arr[0], arr[n - 1]] = [arr[n - 1], arr[0]];
      }
    }
  }

  heapPermute(first9, first9.length);
  return permutations;
}

/**
 * Calculate statistics for all permutations of frames 1-9.
 */
export function calculatePermutationStats(frames: Frame[]): PermutationStats {
  const permutations = generatePermutations(frames);
  const scores = permutations.map(perm => scoreGame(perm));
  const actualScore = scoreGame(frames);

  scores.sort((a, b) => a - b);

  const min = scores[0];
  const max = scores[scores.length - 1];
  const sum = scores.reduce((acc, val) => acc + val, 0);
  const mean = sum / scores.length;

  const midIndex = Math.floor(scores.length / 2);
  const median = scores.length % 2 === 0
    ? (scores[midIndex - 1] + scores[midIndex]) / 2
    : scores[midIndex];

  const frequencyMap = new Map<number, number>();
  for (const score of scores) {
    frequencyMap.set(score, (frequencyMap.get(score) || 0) + 1);
  }

  let maxFrequency = 0;
  for (const freq of frequencyMap.values()) {
    if (freq > maxFrequency) {
      maxFrequency = freq;
    }
  }

  const mode: number[] = [];
  for (const [score, freq] of frequencyMap) {
    if (freq === maxFrequency) {
      mode.push(score);
    }
  }
  mode.sort((a, b) => a - b);

  const histogram: HistogramBin[] = [];
  for (const [score, count] of frequencyMap) {
    histogram.push({
      score,
      count,
      frequency: count / scores.length
    });
  }
  histogram.sort((a, b) => a.score - b.score);

  // Calculate percentile: percentage of scores less than or equal to actual
  const scoresAtOrBelow = scores.filter(s => s <= actualScore).length;
  const actualPercentile = Math.round((scoresAtOrBelow / scores.length) * 100 * 100) / 100;

  // Calculate standard deviation
  const variance = scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);

  // Calculate z-score (how many standard deviations from the mean)
  const zScore = standardDeviation === 0 ? 0 : (actualScore - mean) / standardDeviation;

  // Calculate skewness (measure of asymmetry)
  const cubedDeviations = scores.reduce((acc, score) => acc + Math.pow((score - mean) / standardDeviation, 3), 0);
  const skewness = standardDeviation === 0 ? 0 : cubedDeviations / scores.length;

  return {
    min,
    max,
    mean: Math.round(mean * 100) / 100,
    median,
    mode,
    permutationCount: permutations.length,
    histogram,
    actualPercentile,
    zScore: Math.round(zScore * 100) / 100,
    skewness: Math.round(skewness * 100) / 100,
    standardDeviation: Math.round(standardDeviation * 100) / 100
  };
}

/**
 * Calculate the score contribution for each individual frame.
 * Returns detailed information about each frame including its contribution to the total score.
 */
export function calculateFrameScores(frames: Frame[]): FrameScore[] {
  const rolls: number[] = [];
  const strikeFlags: boolean[] = [];
  const spareFlags: boolean[] = [];

  for (const frame of frames) {
    for (const roll of frame.rolls) {
      rolls.push(roll.value);
    }
    strikeFlags.push(frame.isStrike);
    spareFlags.push(frame.isSpare);
  }

  const frameScores: FrameScore[] = [];
  let rollIndex = 0;
  let cumulativeScore = 0;

  for (let frameIndex = 0; frameIndex < 10; frameIndex += 1) {
    const frame = frames[frameIndex];
    let scoreContribution = 0;
    let pinsKnocked = 0;
    let rollSymbols = '';

    if (strikeFlags[frameIndex]) {
      scoreContribution = 10 + (rolls[rollIndex + 1] ?? 0) + (rolls[rollIndex + 2] ?? 0);
      pinsKnocked = 10;

      if (frameIndex === 9) {
        // 10th frame with strike
        rollSymbols = frame.rolls.map(r => r.symbol).join(' ');
      } else {
        rollSymbols = 'X';
      }

      rollIndex += 1;
    } else if (spareFlags[frameIndex]) {
      scoreContribution = 10 + (rolls[rollIndex + 2] ?? 0);
      pinsKnocked = 10;
      rollSymbols = frame.rolls.map(r => r.symbol).join('');
      rollIndex += 2;
    } else {
      scoreContribution = (rolls[rollIndex] ?? 0) + (rolls[rollIndex + 1] ?? 0);
      pinsKnocked = scoreContribution;
      rollSymbols = frame.rolls.map(r => r.symbol).join('');
      rollIndex += 2;
    }

    cumulativeScore += scoreContribution;

    frameScores.push({
      frameNumber: frameIndex + 1,
      pinsKnocked,
      scoreContribution,
      cumulativeScore,
      rollSymbols,
      isStrike: frame.isStrike,
      isSpare: frame.isSpare
    });
  }

  return frameScores;
}

/**
 * Analyze which frames benefited or suffered most from their position in the game order.
 * This leverages permutation analysis to show positional luck/unluck.
 */
export function analyzeFramePositionalImpact(frames: Frame[]): FrameImpactAnalysis[] {
  if (frames.length !== 10) {
    return [];
  }

  const first9 = frames.slice(0, 9);
  const frame10 = frames[9];
  const actualScores = calculateFrameScores(frames);

  // For each frame in the first 9, calculate its average contribution across all positions
  const impactAnalysis: FrameImpactAnalysis[] = [];

  for (let frameIdx = 0; frameIdx < 9; frameIdx++) {
    const currentFrame = first9[frameIdx];
    const actualContribution = actualScores[frameIdx].scoreContribution;

    // Calculate what this frame would score in each position
    const contributionsInEachPosition: number[] = [];

    for (let position = 0; position < 9; position++) {
      // Create a test arrangement with this frame in the target position
      const testFrames = [...first9];

      // Swap current frame to target position
      [testFrames[frameIdx], testFrames[position]] = [testFrames[position], testFrames[frameIdx]];

      // Calculate score for this arrangement
      const fullGame = [...testFrames, frame10];
      const scores = calculateFrameScores(fullGame);

      // Find which position our frame ended up in after swap
      const contribution = scores[position].scoreContribution;
      contributionsInEachPosition.push(contribution);
    }

    const averageContribution = contributionsInEachPosition.reduce((a, b) => a + b, 0) / contributionsInEachPosition.length;
    const positionBenefit = actualContribution - averageContribution;

    let explanation = '';
    if (currentFrame.isStrike) {
      if (positionBenefit > 5) {
        explanation = `Lucky placement! Strike got strong bonuses (${Math.round(positionBenefit)} pins above average for this position)`;
      } else if (positionBenefit < -5) {
        explanation = `Unlucky placement! Strike got weak bonuses (${Math.round(Math.abs(positionBenefit))} pins below average)`;
      } else {
        explanation = `Strike in neutral position (within ${Math.round(Math.abs(positionBenefit))} pins of average)`;
      }
    } else if (currentFrame.isSpare) {
      if (positionBenefit > 3) {
        explanation = `Great timing! Spare got a strong bonus ball (${Math.round(positionBenefit)} pins above average)`;
      } else if (positionBenefit < -3) {
        explanation = `Bad timing! Spare got a weak bonus ball (${Math.round(Math.abs(positionBenefit))} pins below average)`;
      } else {
        explanation = `Spare in neutral position (within ${Math.round(Math.abs(positionBenefit))} pins of average)`;
      }
    } else {
      // Open frame
      const pinsKnocked = currentFrame.rolls.reduce((sum, roll) => sum + roll.value, 0);
      if (Math.abs(positionBenefit) <= 0.5) {
        explanation = `Open frame (${pinsKnocked} pins) - position doesn't matter much`;
      } else {
        explanation = `Open frame (${pinsKnocked} pins) - minimal positional impact`;
      }
    }

    impactAnalysis.push({
      frameNumber: frameIdx + 1,
      actualContribution,
      averageContribution: Math.round(averageContribution * 10) / 10,
      positionBenefit: Math.round(positionBenefit * 10) / 10,
      rollSymbols: actualScores[frameIdx].rollSymbols,
      isStrike: currentFrame.isStrike,
      isSpare: currentFrame.isSpare,
      explanation
    });
  }

  return impactAnalysis;
}
