import './style.css';
import { parseGame, scoreGame, ParseError, Frame, calculatePermutationStats, PermutationStats } from './bowling';

declare const __BUILD_TIMESTAMP__: string;

type GameResult = {
  frames: Frame[];
  score: number;
  stats: PermutationStats;
};

const buttonPhrases = [
  'Tell My Bowling Fortune',
  'Glimpse Into My Future.. er, Past',
  'Peer Into the Multiverse',
  'Clutch Or Not?',
  'My mom said I\'m pretty good.',
  'What oil pattern is this? Badger?'
];

const rarePhrase = 'Tell Me How Bad I Fucked Up';
const rareChance = 0.001; // 0.1%

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Failed to find app container');
}

app.innerHTML = `
  <h1>Bowling Fortune Teller</h1>
  <label for="scores-input">Frame-by-Frame Score(s)</label>
  <textarea id="scores-input" name="Frame-by-Frame Score(s)" placeholder="9/ X 81 7/ X X 9- 90 X XX6" aria-describedby="scores-help" rows="15" cols="50"></textarea>
  <div id="scores-help" class="description">
    <p>Enter frame-by-frame scores. Use spaces or commas to separate frames.</p>
    <p>Enter one game per line.</p>
    <p>Valid characters:</p>
    <ul>
      <li>0-9</li>
      <li>/</li>
      <li>X</li>
      <li>- (counts the same as 0)</li>
    </ul>
  </div>
  <button id="submit" type="button">Tell My Bowling Fortune</button>
  <div id="feedback" role="status" aria-live="polite"></div>
  <footer class="version">
    <p>Build: ${__BUILD_TIMESTAMP__} CT</p>
  </footer>
`;

const textarea = document.querySelector<HTMLTextAreaElement>('#scores-input');
const submitButton = document.querySelector<HTMLButtonElement>('#submit');
const feedback = document.querySelector<HTMLDivElement>('#feedback');

if (!textarea || !submitButton || !feedback) {
  throw new Error('Failed to initialise UI elements');
}

let phraseIndex = 0;
function cycleButtonLabel(): void {
  const useRare = Math.random() < rareChance;
  if (useRare) {
    submitButton.textContent = rarePhrase;
    return;
  }
  submitButton.textContent = buttonPhrases[phraseIndex];
  phraseIndex = (phraseIndex + 1) % buttonPhrases.length;
}

cycleButtonLabel();
setInterval(cycleButtonLabel, 30000);

submitButton.addEventListener('click', () => {
  if (!textarea.value.trim()) {
    showError('Please provide at least one game.', 1, 1);
    return;
  }

  const lines = textarea.value.replace(/\r/g, '').split('\n');
  const results: GameResult[] = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    if (!line.trim()) {
      showError(`Game ${lineIndex + 1} is empty. Each line must contain exactly ten frames.`, lineIndex + 1, 1);
      return;
    }
    const parseResult = parseGame(line);
    if (parseResult.kind === 'error') {
      showParseError(parseResult, lineIndex, lines);
      return;
    }
    const score = scoreGame(parseResult.frames);
    const stats = calculatePermutationStats(parseResult.frames);
    results.push({ frames: parseResult.frames, score, stats });
  }

  renderResults(results);
});

function showParseError(error: ParseError, rowIndex: number, lines: string[]): void {
  const row = rowIndex + 1;
  const message = `Row ${row}, column ${error.column}: ${error.message}`;
  const cursorIndex = calculateCursorIndex(lines, rowIndex, error.column);
  showError(message, row, error.column, cursorIndex);
}

function calculateCursorIndex(lines: string[], rowIndex: number, column: number): number {
  let index = 0;
  for (let i = 0; i < rowIndex; i += 1) {
    index += lines[i].length + 1; // include newline
  }
  return index + (column - 1);
}

function showError(message: string, row: number, column: number, cursorIndex?: number): void {
  feedback.innerHTML = '';
  feedback.className = 'error';
  feedback.textContent = message;
  textarea.focus();
  if (typeof cursorIndex === 'number') {
    textarea.setSelectionRange(cursorIndex, cursorIndex);
  } else {
    const lines = textarea.value.replace(/\r/g, '').split('\n');
    const idx = calculateCursorIndex(lines, row - 1, column);
    textarea.setSelectionRange(idx, idx);
  }
}

function createHistogram(result: GameResult): string {
  const { histogram, median } = result.stats;
  const actualScore = result.score;

  const width = 600;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxCount = Math.max(...histogram.map(bin => bin.count));
  const minScore = result.stats.min;
  const maxScore = result.stats.max;

  const barWidth = Math.max(2, chartWidth / histogram.length);

  const bars = histogram.map((bin, i) => {
    const x = padding.left + (i * chartWidth) / histogram.length;
    const barHeight = (bin.count / maxCount) * chartHeight;
    const y = padding.top + chartHeight - barHeight;
    const isActual = bin.score === actualScore;

    return `<rect
      x="${x}"
      y="${y}"
      width="${barWidth}"
      height="${barHeight}"
      fill="${isActual ? '#fbbf24' : '#60a5fa'}"
      opacity="${isActual ? '1' : '0.7'}"
    >
      <title>Score: ${bin.score}\nCount: ${bin.count.toLocaleString()}\nFrequency: ${(bin.frequency * 100).toFixed(2)}%</title>
    </rect>`;
  }).join('');

  // Add median line
  const medianX = padding.left + ((median - minScore) / (maxScore - minScore)) * chartWidth;
  const medianLine = `
    <line x1="${medianX}" y1="${padding.top}" x2="${medianX}" y2="${padding.top + chartHeight}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${medianX}" y="${padding.top - 5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `;

  const yAxisTicks = 5;
  const yLabels = Array.from({ length: yAxisTicks + 1 }, (_, i) => {
    const value = Math.round((maxCount / yAxisTicks) * i);
    const y = padding.top + chartHeight - (i * chartHeight) / yAxisTicks;
    return `
      <line x1="${padding.left - 5}" y1="${y}" x2="${padding.left}" y2="${y}" stroke="#94a3b8" stroke-width="1" />
      <text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" font-size="11" fill="#94a3b8">${value.toLocaleString()}</text>
    `;
  }).join('');

  const xAxisTicks = Math.min(10, Math.ceil((maxScore - minScore) / 10));
  const xLabels = Array.from({ length: xAxisTicks + 1 }, (_, i) => {
    const score = Math.round(minScore + ((maxScore - minScore) / xAxisTicks) * i);
    const x = padding.left + (i * chartWidth) / xAxisTicks;
    return `
      <line x1="${x}" y1="${padding.top + chartHeight}" x2="${x}" y2="${padding.top + chartHeight + 5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${x}" y="${padding.top + chartHeight + 20}" text-anchor="middle" font-size="11" fill="#94a3b8">${score}</text>
    `;
  }).join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" class="histogram">
      <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(15, 23, 42, 0.5)" />
      ${bars}
      ${medianLine}
      <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartHeight}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${padding.left + chartWidth}" y2="${padding.top + chartHeight}" stroke="#94a3b8" stroke-width="2" />
      ${yLabels}
      ${xLabels}
      <text x="${padding.left + chartWidth / 2}" y="${height - 5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="${15}" y="${padding.top + chartHeight / 2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${padding.top + chartHeight / 2})">Count</text>
    </svg>
  `;
}

function getNarrative(result: GameResult): string {
  const { zScore, actualPercentile, skewness } = result.stats;
  const expectedPinsDiff = result.score - result.stats.median;

  let interpretation = '';

  // Z-score interpretation
  if (Math.abs(zScore) < 0.5) {
    interpretation = 'Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.';
  } else if (zScore >= 2) {
    interpretation = 'Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!';
  } else if (zScore <= -2) {
    interpretation = 'Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.';
  } else if (zScore > 1) {
    interpretation = 'Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.';
  } else if (zScore < -1) {
    interpretation = 'Your score was <strong>notably below average</strong> — your frame order worked against you.';
  } else if (zScore > 0) {
    interpretation = 'Your score was <strong>slightly above average</strong> — a bit luckier than typical.';
  } else {
    interpretation = 'Your score was <strong>slightly below average</strong> — a bit unluckier than typical.';
  }

  // Add context about position in distribution
  if (actualPercentile >= 95) {
    interpretation += ' You scored in the <strong>top 5%</strong> of all possible orderings.';
  } else if (actualPercentile >= 75) {
    interpretation += ' You scored in the <strong>top quartile</strong> of possible orderings.';
  } else if (actualPercentile <= 5) {
    interpretation += ' You scored in the <strong>bottom 5%</strong> of all possible orderings.';
  } else if (actualPercentile <= 25) {
    interpretation += ' You scored in the <strong>bottom quartile</strong> of possible orderings.';
  }

  return interpretation;
}

function renderResults(results: GameResult[]): void {
  feedback.className = 'output';
  if (results.length === 0) {
    feedback.innerHTML = '';
    return;
  }
  const cards = results
    .map((result, index) => {
      const gameNumber = index + 1;
      const modeStr = result.stats.mode.length === 1
        ? result.stats.mode[0].toString()
        : `${result.stats.mode.join(', ')} (multimodal)`;

      const expectedPinsDiff = result.score - result.stats.median;
      const expectedPinsStr = expectedPinsDiff >= 0
        ? `+${expectedPinsDiff}`
        : `${expectedPinsDiff}`;

      const narrative = getNarrative(result);

      return `
        <article class="result-card">
          <h2>Game ${gameNumber}</h2>
          <p><strong>Actual score:</strong> ${result.score}</p>

          <div class="narrative">
            <p>${narrative}</p>
          </div>

          <div class="histogram-container">
            ${createHistogram(result)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          <dl class="stats">
            <dt>Permutations analyzed:</dt>
            <dd>${result.stats.permutationCount.toLocaleString()}</dd>

            <dt>Percentile:</dt>
            <dd>${result.stats.actualPercentile}%</dd>

            <dt>Z-score:</dt>
            <dd>${result.stats.zScore}</dd>

            <dt>Expected Pins +/-:</dt>
            <dd>${expectedPinsStr}</dd>

            <dt>Minimum score:</dt>
            <dd>${result.stats.min}</dd>

            <dt>Maximum score:</dt>
            <dd>${result.stats.max}</dd>

            <dt>Mean score:</dt>
            <dd>${result.stats.mean}</dd>

            <dt>Median score:</dt>
            <dd>${result.stats.median}</dd>

            <dt>Standard deviation:</dt>
            <dd>${result.stats.standardDeviation}</dd>

            <dt>Skewness:</dt>
            <dd>${result.stats.skewness}</dd>

            <dt>Mode:</dt>
            <dd>${modeStr}</dd>
          </dl>
        </article>
      `;
    })
    .join('');

  feedback.innerHTML = `<section class="results">${cards}</section>`;
}
