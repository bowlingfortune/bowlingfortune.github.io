import './style.css';
import { parseGame, scoreGame, ParseError, Frame } from './bowling';

type GameResult = {
  frames: Frame[];
  score: number;
};

const buttonPhrases = [
  'Tell My Bowling Fortune',
  'Glimpse Into My Future.. er, Past',
  'Peer Into the Multiverse',
  'Clutch Or Not?'
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
  <p id="scores-help" class="description">
    Enter frame-by-frame scores. Use spaces or commas to separate frames.<br />
    Enter one game per line.<br />
    Valid characters:<br />
    * 0-9<br />
    * /<br />
    * X<br />
    * - (counts the same as 0)
  </p>
  <button id="submit" type="button">Tell My Bowling Fortune</button>
  <div id="feedback" role="status" aria-live="polite"></div>
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
setInterval(cycleButtonLabel, 4000);

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
    results.push({ frames: parseResult.frames, score });
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

function renderResults(results: GameResult[]): void {
  feedback.className = 'output';
  if (results.length === 0) {
    feedback.innerHTML = '';
    return;
  }
  const cards = results
    .map((result, index) => {
      const gameNumber = index + 1;
      return `
        <article class="result-card">
          <h2>Game ${gameNumber}</h2>
          <p><strong>Final score:</strong> ${result.score}</p>
        </article>
      `;
    })
    .join('');

  feedback.innerHTML = `<section class="results">${cards}</section>`;
}
