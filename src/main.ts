import './style.css';
import { parseGame, scoreGame, ParseError, Frame, calculatePermutationStats, PermutationStats, calculateFrameScores, FrameScore } from './bowling';
import { saveGame, loadGames, deleteGame, clearAllGames, getUniqueLeagues, exportGames, importGames, SavedGame } from './storage';

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
  'What oil pattern is this? Badger?',
  'Calculate my shame',
  'How lucky was I, really?',
  'Did I deserve this score?',
  'Explain my misery',
  'Tell me I\'m special',
  'Judge my frame order',
  'Was that skill or luck?',
  'Is this thing scratch-and-sniff?',
  'Like a 50/50 raffle, but you never win',
  'We lost by 3 pins, but it definitely wasn\'t my fault... right?'
];

const rarePhrases = [
  'Tell Me How Bad I Fucked Up',
  'RATE MUH BALLS'
];
const rareChance = 0.001; // 0.1%

// Example scenarios with descriptions
const exampleScenarios = [
  {
    name: 'Perfect Game (300)',
    description: 'The ultimate achievement - 12 strikes in a row',
    score: 'X X X X X X X X X XXX'
  },
  {
    name: 'Lucky Game',
    description: 'Actual score much higher than median - very favorable frame order',
    score: '81 72 63 54 9/ X X X X XXX'
  },
  {
    name: 'Unlucky Game',
    description: 'Actual score lower than median - unfavorable frame order',
    score: '2/ 1/ 35 X 34 62 4/ 45 8/ 60'
  },
  {
    name: 'Average Game',
    description: 'Typical performance - score close to median',
    score: '9/ 45 03 7/ 40 90 09 9/ X 04'
  },
  {
    name: 'Low Score Game',
    description: 'Rough day at the lanes - lots of open frames',
    score: '52 7- 43 8- 61 72 54 6- 81 7-'
  },
  {
    name: 'Multiple Games Series',
    description: 'Three-game series showing different performances',
    score: '9/ X 81 7/ X X 9- 90 X XX6\nX X X X X X X X X XXX\n7/ 6- X 81 9/ X 7- X X X90'
  },
  {
    name: 'Clutch Performance',
    description: 'Strong finish with strikes in the 10th',
    score: '7/ 8/ 81 9- 72 X 9/ 8- X XXX'
  },
  {
    name: 'All Spares Game',
    description: 'Consistent spare shooting - no strikes, no open frames',
    score: '9/ 8/ 7/ 6/ 5/ 4/ 3/ 2/ 1/ 9/9'
  }
];

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Failed to find app container');
}

app.innerHTML = `
  <h1>Bowling Fortune Teller 🎳</h1>
  <div class="brought-to-you">
    brought to you by <img src="/logo.png" alt="Pocket Penetration" class="sponsor-logo">
  </div>
  <label for="scores-input">Frame-by-Frame Score(s)</label>
  <textarea id="scores-input" name="Frame-by-Frame Score(s)" placeholder="9/ X 81 7/ X X 9- 90 X XX6" aria-describedby="scores-help" rows="15" cols="50"></textarea>
  <div class="textarea-footer">
    <div class="example-dropdown-container">
      <button id="example-btn" type="button" class="secondary-btn example-btn" aria-haspopup="true" aria-expanded="false">
        Try an example
        <span class="dropdown-arrow">▼</span>
      </button>
      <div id="example-dropdown" class="example-dropdown" role="menu" aria-hidden="true">
        ${exampleScenarios.map((scenario, index) => `
          <button type="button" class="dropdown-item" data-example-index="${index}" role="menuitem">
            <strong>${scenario.name}</strong>
            <span class="dropdown-item-desc">${scenario.description}</span>
          </button>
        `).join('')}
      </div>
    </div>
    <button id="clear-btn" type="button" class="secondary-btn">Clear</button>
    <button id="save-btn" type="button" class="secondary-btn">💾 Save</button>
    <button id="saved-games-btn" type="button" class="secondary-btn">
      📋 Saved Games <span id="saved-count"></span>
    </button>
  </div>
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

  <!-- Save Modal -->
  <div id="save-modal-overlay" class="modal-overlay">
    <div class="save-modal">
      <h2>Save Game</h2>
      <form id="save-form">
        <label for="save-description">Description (optional)</label>
        <input type="text" id="save-description" placeholder="e.g., Practice session" />

        <label for="save-league">League (optional)</label>
        <input type="text" id="save-league" list="league-list" placeholder="e.g., Tuesday Night League" />
        <datalist id="league-list"></datalist>

        <label for="save-date">Date (optional)</label>
        <input type="date" id="save-date" />

        <div class="modal-actions">
          <button type="button" id="save-cancel-btn" class="secondary-btn">Cancel</button>
          <button type="submit" class="primary-btn">Save</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Saved Games Sidebar -->
  <div id="saved-games-sidebar" class="saved-games-sidebar">
    <div class="sidebar-header">
      <h2>📋 Saved Games <span id="sidebar-saved-count"></span></h2>
      <button id="sidebar-close-btn" class="close-btn" aria-label="Close sidebar">×</button>
    </div>

    <div class="sidebar-search">
      <input type="text" id="search-saved-games" placeholder="Search by league or description..." />
    </div>

    <div class="sidebar-actions">
      <div class="action-buttons-row">
        <button id="export-btn" class="secondary-btn">Export JSON</button>
        <button id="import-btn" class="secondary-btn">Import JSON</button>
      </div>
      <button id="clear-all-btn" class="secondary-btn">Clear All</button>
    </div>

    <div id="saved-games-list" class="saved-games-list">
      <!-- Saved games will be rendered here -->
    </div>
  </div>

  <!-- Hidden file input for import -->
  <input type="file" id="import-file-input" accept=".json" style="display: none;" />

  <!-- Sidebar Overlay -->
  <div id="sidebar-overlay" class="sidebar-overlay"></div>
`;

const textarea = document.querySelector<HTMLTextAreaElement>('#scores-input');
const submitButton = document.querySelector<HTMLButtonElement>('#submit');
const clearButton = document.querySelector<HTMLButtonElement>('#clear-btn');
const exampleButton = document.querySelector<HTMLButtonElement>('#example-btn');
const exampleDropdown = document.querySelector<HTMLDivElement>('#example-dropdown');
const feedback = document.querySelector<HTMLDivElement>('#feedback');
const saveButton = document.querySelector<HTMLButtonElement>('#save-btn');
const savedGamesButton = document.querySelector<HTMLButtonElement>('#saved-games-btn');
const savedCountBadge = document.querySelector<HTMLSpanElement>('#saved-count');
const saveModalOverlay = document.querySelector<HTMLDivElement>('#save-modal-overlay');
const saveForm = document.querySelector<HTMLFormElement>('#save-form');
const saveDescriptionInput = document.querySelector<HTMLInputElement>('#save-description');
const saveLeagueInput = document.querySelector<HTMLInputElement>('#save-league');
const leagueDatalist = document.querySelector<HTMLDataListElement>('#league-list');
const saveDateInput = document.querySelector<HTMLInputElement>('#save-date');
const saveCancelButton = document.querySelector<HTMLButtonElement>('#save-cancel-btn');
const savedGamesSidebar = document.querySelector<HTMLDivElement>('#saved-games-sidebar');
const sidebarOverlay = document.querySelector<HTMLDivElement>('#sidebar-overlay');
const sidebarCloseButton = document.querySelector<HTMLButtonElement>('#sidebar-close-btn');
const searchSavedGamesInput = document.querySelector<HTMLInputElement>('#search-saved-games');
const exportButton = document.querySelector<HTMLButtonElement>('#export-btn');
const importButton = document.querySelector<HTMLButtonElement>('#import-btn');
const importFileInput = document.querySelector<HTMLInputElement>('#import-file-input');
const clearAllButton = document.querySelector<HTMLButtonElement>('#clear-all-btn');
const savedGamesList = document.querySelector<HTMLDivElement>('#saved-games-list');
const sidebarSavedCount = document.querySelector<HTMLSpanElement>('#sidebar-saved-count');

if (!textarea || !submitButton || !clearButton || !exampleButton || !exampleDropdown || !feedback ||
    !saveButton || !savedGamesButton || !savedCountBadge || !saveModalOverlay || !saveForm ||
    !saveDescriptionInput || !saveLeagueInput || !leagueDatalist || !saveDateInput || !saveCancelButton ||
    !savedGamesSidebar || !sidebarOverlay || !sidebarCloseButton || !searchSavedGamesInput ||
    !exportButton || !importButton || !importFileInput || !clearAllButton || !savedGamesList || !sidebarSavedCount) {
  throw new Error('Failed to initialise UI elements');
}

clearButton.addEventListener('click', () => {
  textarea.value = '';
  feedback.innerHTML = '';
  textarea.focus();
});

// Dropdown functionality
let isDropdownOpen = false;

function toggleDropdown() {
  isDropdownOpen = !isDropdownOpen;
  exampleDropdown.classList.toggle('show', isDropdownOpen);
  exampleButton.setAttribute('aria-expanded', isDropdownOpen.toString());
  exampleDropdown.setAttribute('aria-hidden', (!isDropdownOpen).toString());
}

function closeDropdown() {
  isDropdownOpen = false;
  exampleDropdown.classList.remove('show');
  exampleButton.setAttribute('aria-expanded', 'false');
  exampleDropdown.setAttribute('aria-hidden', 'true');
}

exampleButton.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleDropdown();
});

// Handle example selection from dropdown
const dropdownItems = exampleDropdown.querySelectorAll<HTMLButtonElement>('.dropdown-item');
dropdownItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const index = parseInt(item.getAttribute('data-example-index') || '0', 10);
    textarea.value = exampleScenarios[index].score;
    closeDropdown();
    textarea.focus();
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (isDropdownOpen && !exampleButton.contains(target) && !exampleDropdown.contains(target)) {
    closeDropdown();
  }
});

// Keyboard navigation for dropdown
exampleDropdown.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    const items = Array.from(dropdownItems);
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);

    let nextIndex: number;
    if (e.key === 'ArrowDown') {
      nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    }
    items[nextIndex]?.focus();
  }
});

let phraseIndex = 0;
function cycleButtonLabel(): void {
  const useRare = Math.random() < rareChance;
  if (useRare) {
    const rareIndex = Math.floor(Math.random() * rarePhrases.length);
    submitButton.textContent = rarePhrases[rareIndex];
    return;
  }
  submitButton.textContent = buttonPhrases[phraseIndex];
  phraseIndex = (phraseIndex + 1) % buttonPhrases.length;
}

cycleButtonLabel();
setInterval(cycleButtonLabel, 30000);

let currentScoresInput = '';

function processScores() {
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

  currentScoresInput = textarea.value;
  renderResults(results);
}

submitButton.addEventListener('click', processScores);

// Keyboard shortcuts
textarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    processScores();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close sidebar first if open
    if (savedGamesSidebar.classList.contains('show')) {
      closeSidebar();
      return;
    }
    // Close save modal if open
    if (saveModalOverlay.classList.contains('show')) {
      closeSaveModal();
      return;
    }
    // Close dropdown if open
    if (isDropdownOpen) {
      closeDropdown();
      exampleButton.focus();
      return;
    }
    // Otherwise, clear feedback as before
    if (feedback.innerHTML) {
      feedback.innerHTML = '';
      textarea.focus();
    }
  }
});

// Save/Load Functionality
function updateSavedGamesCount() {
  const games = loadGames();
  const count = games.length;
  savedCountBadge.innerHTML = count > 0 ? `&nbsp;(${count})` : '';
  sidebarSavedCount.innerHTML = count > 0 ? `&nbsp;(${count})` : '';
}

function showSaveModal() {
  if (!textarea.value.trim()) {
    showToast('Please enter some scores first');
    return;
  }

  // Pre-fill today's date
  const today = new Date().toISOString().split('T')[0];
  saveDateInput.value = today;
  saveDescriptionInput.value = '';
  saveLeagueInput.value = '';

  // Populate league autocomplete
  const leagues = getUniqueLeagues();
  leagueDatalist.innerHTML = leagues.map(league =>
    `<option value="${league}">`
  ).join('');

  saveModalOverlay.classList.add('show');
  saveDescriptionInput.focus();
}

function closeSaveModal() {
  saveModalOverlay.classList.remove('show');
}

function showSidebar() {
  searchSavedGamesInput.value = ''; // Clear search when opening
  renderSavedGamesList();
  savedGamesSidebar.classList.add('show');
  sidebarOverlay.classList.add('show');
}

function closeSidebar() {
  savedGamesSidebar.classList.remove('show');
  sidebarOverlay.classList.remove('show');
}

function renderSavedGamesList() {
  const searchQuery = searchSavedGamesInput.value.trim().toLowerCase();
  let games = loadGames();

  // Filter by search query
  if (searchQuery) {
    games = games.filter(game => {
      const description = (game.description || '').toLowerCase();
      const league = (game.league || '').toLowerCase();
      return description.includes(searchQuery) || league.includes(searchQuery);
    });
  }

  if (games.length === 0) {
    savedGamesList.innerHTML = searchQuery
      ? '<p class="empty-state">No games match your search.</p>'
      : '<p class="empty-state">No saved games yet. Save your first game!</p>';
    return;
  }

  savedGamesList.innerHTML = games.map(game => {
    const gameCountText = game.gameCount === 1 ? '1 game' : `${game.gameCount} games`;
    const scoreText = game.totalScore !== undefined ? `🎯 ${game.totalScore}` : '⚠️ Invalid';
    const descriptionText = game.description || '(No description)';
    const leagueText = game.league ? `🏆 ${game.league}` : '';

    return `
      <div class="saved-game-card" data-game-id="${game.id}">
        <div class="saved-game-info">
          <h3>${descriptionText}</h3>
          ${leagueText ? `<p class="saved-game-league">${leagueText}</p>` : ''}
          <p class="saved-game-meta">
            📅 ${game.date} | 🎳 ${gameCountText} | ${scoreText}
          </p>
        </div>
        <div class="saved-game-actions">
          <button class="load-btn" data-load-id="${game.id}">Load</button>
          <button class="delete-btn" data-delete-id="${game.id}">Delete</button>
        </div>
      </div>
    `;
  }).join('');

  // Add event listeners for load and delete buttons
  savedGamesList.querySelectorAll<HTMLButtonElement>('[data-load-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-load-id');
      if (id) loadSavedGame(id);
    });
  });

  savedGamesList.querySelectorAll<HTMLButtonElement>('[data-delete-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-id');
      if (id) deleteSavedGame(id);
    });
  });
}

function loadSavedGame(id: string) {
  const games = loadGames();
  const game = games.find(g => g.id === id);

  if (game) {
    textarea.value = game.scores;
    closeSidebar();
    submitButton.click();
    showToast('Game loaded!');
  }
}

function deleteSavedGame(id: string) {
  if (confirm('Delete this saved game?')) {
    deleteGame(id);
    updateSavedGamesCount();
    renderSavedGamesList();
    showToast('Game deleted');
  }
}

// Event Listeners for Save/Load
saveButton.addEventListener('click', showSaveModal);
savedGamesButton.addEventListener('click', showSidebar);
saveCancelButton.addEventListener('click', closeSaveModal);
sidebarCloseButton.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// Search input listener
searchSavedGamesInput.addEventListener('input', () => {
  renderSavedGamesList();
});

saveModalOverlay.addEventListener('click', (e) => {
  if (e.target === saveModalOverlay) {
    closeSaveModal();
  }
});

saveForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const scores = textarea.value.trim();
  const description = saveDescriptionInput.value.trim() || undefined;
  const league = saveLeagueInput.value.trim() || undefined;
  let date = saveDateInput.value || undefined;

  // Validate date is not in the future
  if (date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      showToast('Date cannot be in the future');
      saveDateInput.focus();
      return;
    }
  }

  try {
    saveGame(scores, description, league, date);
    closeSaveModal();
    updateSavedGamesCount();
    // If sidebar is open, refresh the list
    if (savedGamesSidebar.classList.contains('show')) {
      renderSavedGamesList();
    }
    showToast('Game saved!');
  } catch (error) {
    console.error('Failed to save game', error);
    showToast('Failed to save game');
  }
});

clearAllButton.addEventListener('click', () => {
  if (confirm('Delete ALL saved games? This cannot be undone.')) {
    clearAllGames();
    updateSavedGamesCount();
    renderSavedGamesList();
    showToast('All games deleted');
  }
});

// Export games
exportButton.addEventListener('click', () => {
  const games = loadGames();
  if (games.length === 0) {
    showToast('No games to export');
    return;
  }

  const jsonData = exportGames();
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bowling-games-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Exported ${games.length} game${games.length === 1 ? '' : 's'}`);
});

// Import games
importButton.addEventListener('click', () => {
  importFileInput.click();
});

importFileInput.addEventListener('change', (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const jsonData = event.target?.result as string;
    const result = importGames(jsonData);

    if (result.success) {
      updateSavedGamesCount();
      renderSavedGamesList();
      showToast(`Imported ${result.count} game${result.count === 1 ? '' : 's'}`);
    } else {
      showToast(result.error || 'Import failed');
    }

    // Reset file input
    importFileInput.value = '';
  };

  reader.onerror = () => {
    showToast('Failed to read file');
    importFileInput.value = '';
  };

  reader.readAsText(file);
});

// Initialize saved games count on load
updateSavedGamesCount();

// Check for scores in URL on load
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const encodedScores = params.get('scores');

  if (encodedScores) {
    try {
      const decodedScores = atob(encodedScores);
      textarea.value = decodedScores;
      processScores();
    } catch (e) {
      console.error('Failed to decode scores from URL', e);
    }
  }
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

  const minScore = result.stats.min;
  const maxScore = result.stats.max;

  // Create a complete histogram with all scores from min to max
  const histogramMap = new Map(histogram.map(bin => [bin.score, bin]));
  const completeHistogram: Array<{ score: number; count: number; frequency: number }> = [];
  for (let score = minScore; score <= maxScore; score++) {
    const bin = histogramMap.get(score);
    completeHistogram.push({
      score,
      count: bin?.count ?? 0,
      frequency: bin?.frequency ?? 0
    });
  }

  const maxCount = Math.max(...completeHistogram.map(bin => bin.count));
  const barWidth = Math.max(2, chartWidth / completeHistogram.length);

  const bars = completeHistogram.map((bin, i) => {
    const x = padding.left + (i * chartWidth) / completeHistogram.length;
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

  // Add median line - now that bars are continuous from min to max, position is straightforward
  const medianBinIndex = median - minScore;
  const medianX = padding.left + (medianBinIndex * chartWidth) / completeHistogram.length + barWidth / 2;
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
  const xLabels = xAxisTicks === 0
    ? `
      <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${padding.left}" y2="${padding.top + chartHeight + 5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${padding.left}" y="${padding.top + chartHeight + 20}" text-anchor="middle" font-size="11" fill="#94a3b8">${minScore}</text>
    `
    : Array.from({ length: xAxisTicks + 1 }, (_, i) => {
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

function getAchievementEmoji(percentile: number, median: number, actualScore: number): string {
  // Top 5% - exceptional
  if (percentile >= 95) return '🏆';

  // Exactly median - perfectly average
  if (actualScore === median) return '🎯';

  // Bottom 5% - exceptionally unlucky
  if (percentile <= 5) return '💀';

  // Top quartile - lucky
  if (percentile >= 75) return '🍀';

  // Bottom quartile - unlucky
  if (percentile <= 25) return '😅';

  // Normal range - typical
  return '📊';
}

function getNarrative(result: GameResult): string {
  const { zScore, actualPercentile, skewness, median } = result.stats;
  const expectedPinsDiff = result.score - result.stats.median;

  const emoji = getAchievementEmoji(actualPercentile, median, result.score);
  let interpretation = `${emoji} `;

  // Z-score interpretation
  if (Math.abs(zScore) < 0.5) {
    interpretation += 'Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.';
  } else if (zScore >= 2) {
    interpretation += 'Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!';
  } else if (zScore <= -2) {
    interpretation += 'Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.';
  } else if (zScore > 1) {
    interpretation += 'Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.';
  } else if (zScore < -1) {
    interpretation += 'Your score was <strong>notably below average</strong> — your frame order worked against you.';
  } else if (zScore > 0) {
    interpretation += 'Your score was <strong>slightly above average</strong> — a bit luckier than typical.';
  } else {
    interpretation += 'Your score was <strong>slightly below average</strong> — a bit unluckier than typical.';
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

function computeSeriesDistribution(results: GameResult[]): Map<number, number> {
  // Compute the distribution of series scores by convolving individual game distributions
  let distribution = new Map<number, number>();

  // Start with the first game's distribution
  for (const bin of results[0].stats.histogram) {
    distribution.set(bin.score, bin.count);
  }

  // Convolve with each subsequent game's distribution
  for (let i = 1; i < results.length; i++) {
    const newDistribution = new Map<number, number>();

    for (const [score1, count1] of distribution) {
      for (const bin of results[i].stats.histogram) {
        const combinedScore = score1 + bin.score;
        const combinedCount = count1 * bin.count;
        newDistribution.set(combinedScore, (newDistribution.get(combinedScore) || 0) + combinedCount);
      }
    }

    distribution = newDistribution;
  }

  return distribution;
}

function createSeriesHistogram(results: GameResult[], totalScore: number): string {
  const distribution = computeSeriesDistribution(results);

  // Convert to sorted array for histogram
  const histogram: Array<{ score: number; count: number }> = [];
  for (const [score, count] of distribution) {
    histogram.push({ score, count });
  }
  histogram.sort((a, b) => a.score - b.score);

  const width = 600;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minScore = histogram[0].score;
  const maxScore = histogram[histogram.length - 1].score;

  // Create a complete histogram with all scores from min to max
  const histogramMap = new Map(histogram.map(bin => [bin.score, bin]));
  const completeHistogram: Array<{ score: number; count: number }> = [];
  for (let score = minScore; score <= maxScore; score++) {
    const bin = histogramMap.get(score);
    completeHistogram.push({
      score,
      count: bin?.count ?? 0
    });
  }

  const maxCount = Math.max(...completeHistogram.map(bin => bin.count));

  // Calculate median for series
  const totalCombinations = Array.from(distribution.values()).reduce((sum, count) => sum + count, 0);
  let cumulativeCount = 0;
  let seriesMedian = 0;
  for (const bin of histogram) {
    cumulativeCount += bin.count;
    if (cumulativeCount >= totalCombinations / 2) {
      seriesMedian = bin.score;
      break;
    }
  }

  const barWidth = Math.max(2, chartWidth / completeHistogram.length);

  const bars = completeHistogram.map((bin, i) => {
    const x = padding.left + (i * chartWidth) / completeHistogram.length;
    const barHeight = (bin.count / maxCount) * chartHeight;
    const y = padding.top + chartHeight - barHeight;
    const isActual = bin.score === totalScore;

    return `<rect
      x="${x}"
      y="${y}"
      width="${barWidth}"
      height="${barHeight}"
      fill="${isActual ? '#fbbf24' : '#60a5fa'}"
      opacity="${isActual ? '1' : '0.7'}"
    >
      <title>Series Score: ${bin.score}\nCombinations: ${bin.count.toLocaleString()}</title>
    </rect>`;
  }).join('');

  // Add median line - now that bars are continuous from min to max, position is straightforward
  const medianBinIndex = seriesMedian - minScore;
  const medianX = padding.left + (medianBinIndex * chartWidth) / completeHistogram.length + barWidth / 2;
  const medianLine = `
    <line x1="${medianX}" y1="${padding.top}" x2="${medianX}" y2="${padding.top + chartHeight}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${medianX}" y="${padding.top - 5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `;

  // Skip Y-axis labels for series (numbers get too large)
  const yLabels = '';

  const xAxisTicks = Math.min(10, Math.ceil((maxScore - minScore) / 20));
  const xLabels = xAxisTicks === 0
    ? `
      <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${padding.left}" y2="${padding.top + chartHeight + 5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${padding.left}" y="${padding.top + chartHeight + 20}" text-anchor="middle" font-size="11" fill="#94a3b8">${minScore}</text>
    `
    : Array.from({ length: xAxisTicks + 1 }, (_, i) => {
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
      <text x="${padding.left + chartWidth / 2}" y="${height - 5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `;
}

function renderSeriesSummary(results: GameResult[]): string {
  if (results.length < 2) return '';

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const avgScore = Math.round((totalScore / results.length) * 100) / 100;

  // Compute series-level statistics from distribution
  const distribution = computeSeriesDistribution(results);
  const histogram: Array<{ score: number; count: number }> = [];
  for (const [score, count] of distribution) {
    histogram.push({ score, count });
  }
  histogram.sort((a, b) => a.score - b.score);

  const totalCombinations = Array.from(distribution.values()).reduce((sum, count) => sum + count, 0);

  // Calculate series min and max
  const seriesMin = histogram[0].score;
  const seriesMax = histogram[histogram.length - 1].score;

  // Calculate series mean
  let weightedSum = 0;
  for (const bin of histogram) {
    weightedSum += bin.score * bin.count;
  }
  const seriesMean = weightedSum / totalCombinations;

  // Calculate series median
  let cumulativeCount = 0;
  let seriesMedian = 0;
  for (const bin of histogram) {
    cumulativeCount += bin.count;
    if (cumulativeCount >= totalCombinations / 2) {
      seriesMedian = bin.score;
      break;
    }
  }

  // Calculate series percentile
  const scoresAtOrBelow = histogram
    .filter(bin => bin.score <= totalScore)
    .reduce((sum, bin) => sum + bin.count, 0);
  const seriesPercentile = Math.round((scoresAtOrBelow / totalCombinations) * 100 * 100) / 100;

  // Calculate series standard deviation
  let varianceSum = 0;
  for (const bin of histogram) {
    varianceSum += Math.pow(bin.score - seriesMean, 2) * bin.count;
  }
  const seriesStdDev = Math.sqrt(varianceSum / totalCombinations);

  // Calculate series z-score
  const seriesZScore = seriesStdDev === 0 ? 0 : (totalScore - seriesMean) / seriesStdDev;

  // Calculate series skewness
  let cubedDeviationsSum = 0;
  for (const bin of histogram) {
    cubedDeviationsSum += Math.pow((bin.score - seriesMean) / seriesStdDev, 3) * bin.count;
  }
  const seriesSkewness = seriesStdDev === 0 ? 0 : cubedDeviationsSum / totalCombinations;

  // Calculate series mode
  let maxFrequency = 0;
  for (const bin of histogram) {
    if (bin.count > maxFrequency) {
      maxFrequency = bin.count;
    }
  }
  const seriesMode: number[] = [];
  for (const bin of histogram) {
    if (bin.count === maxFrequency) {
      seriesMode.push(bin.score);
    }
  }

  const expectedDiff = totalScore - seriesMedian;
  const expectedDiffStr = expectedDiff >= 0 ? `+${expectedDiff}` : `${expectedDiff}`;

  const modeStr = seriesMode.length === 1
    ? seriesMode[0].toString()
    : `${seriesMode.join(', ')} (multimodal)`;

  // Series narrative
  let seriesNarrative = '';
  if (Math.abs(seriesZScore) < 0.5) {
    seriesNarrative = 'Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.';
  } else if (seriesZScore >= 2) {
    seriesNarrative = 'Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!';
  } else if (seriesZScore <= -2) {
    seriesNarrative = 'Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.';
  } else if (seriesZScore >= 1) {
    seriesNarrative = 'Across this series, you had <strong>notably favorable</strong> frame sequences.';
  } else if (seriesZScore <= -1) {
    seriesNarrative = 'Across this series, you had <strong>notably unfavorable</strong> frame sequences.';
  } else if (seriesZScore > 0) {
    seriesNarrative = 'Across this series, your frame orders were <strong>slightly favorable</strong> overall.';
  } else {
    seriesNarrative = 'Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.';
  }

  if (seriesPercentile >= 95) {
    seriesNarrative += ' You scored in the <strong>top 5%</strong> of all possible series combinations.';
  } else if (seriesPercentile >= 75) {
    seriesNarrative += ' You scored in the <strong>top quartile</strong> of possible combinations.';
  } else if (seriesPercentile <= 5) {
    seriesNarrative += ' You scored in the <strong>bottom 5%</strong> of all possible combinations.';
  } else if (seriesPercentile <= 25) {
    seriesNarrative += ' You scored in the <strong>bottom quartile</strong> of possible combinations.';
  }

  return `
    <article class="result-card series-summary">
      <h2>Series Summary (${results.length} Games)</h2>

      <div class="narrative">
        <p>${seriesNarrative}</p>
      </div>

      <div class="histogram-container">
        ${createSeriesHistogram(results, totalScore)}
        <p class="histogram-note">
          <span style="color: #fbbf24;">■</span> Your actual series score
          <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other combinations
          <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
        </p>
      </div>

      <dl class="stats">
        <dt>Total score:</dt>
        <dd>${totalScore}</dd>

        <dt>Average score per game:</dt>
        <dd>${avgScore}</dd>

        <dt>Percentile:</dt>
        <dd>${seriesPercentile}%</dd>

        <dt>Z-score:</dt>
        <dd>${Math.round(seriesZScore * 100) / 100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${expectedDiffStr}</dd>

        <dt>Minimum score:</dt>
        <dd>${seriesMin}</dd>

        <dt>Maximum score:</dt>
        <dd>${seriesMax}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(seriesMean * 100) / 100}</dd>

        <dt>Median score:</dt>
        <dd>${seriesMedian}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(seriesStdDev * 100) / 100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(seriesSkewness * 100) / 100}</dd>

        <dt>Mode:</dt>
        <dd>${modeStr}</dd>
      </dl>
    </article>
  `;
}

function generateShareableLink(): string {
  const encodedScores = btoa(currentScoresInput);
  const url = new URL(window.location.href);
  url.search = `?scores=${encodeURIComponent(encodedScores)}`;
  return url.toString();
}

function copyLinkToClipboard() {
  const link = generateShareableLink();
  navigator.clipboard.writeText(link).then(() => {
    showToast('Link copied!');
  }).catch((err) => {
    console.error('Failed to copy link', err);
    showToast('Failed to copy link');
  });
}

function showToast(message: string) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2000);
}

function renderFrameImpact(frames: Frame[]): string {
  const frameScores = calculateFrameScores(frames);

  // Exclude 10th frame from hero/villain analysis since it has special scoring rules
  const framesForAnalysis = frameScores.slice(0, 9);

  // Sort by score contribution
  const sortedByContribution = [...framesForAnalysis].sort((a, b) => b.scoreContribution - a.scoreContribution);

  // Get top 3 heroes and bottom 3 villains
  const heroes = sortedByContribution.slice(0, 3);
  const villains = sortedByContribution.slice(-3).reverse();

  function renderFrame(fs: FrameScore, emoji: string): string {
    // Determine explanation based on what happened
    let explanation = '';

    if (fs.isStrike) {
      if (fs.scoreContribution === 30) {
        explanation = `Strike with 2 more strikes for maximum ${fs.scoreContribution} points`;
      } else if (fs.scoreContribution >= 20) {
        explanation = `Strike with strong follow-ups for ${fs.scoreContribution} points`;
      } else {
        explanation = `Strike but weak follow-ups: only ${fs.scoreContribution} points`;
      }
    } else if (fs.isSpare) {
      if (fs.scoreContribution >= 20) {
        explanation = `Spare with strike bonus for ${fs.scoreContribution} points`;
      } else if (fs.scoreContribution >= 15) {
        explanation = `Spare with decent bonus for ${fs.scoreContribution} points`;
      } else {
        explanation = `Spare with weak bonus: ${fs.scoreContribution} points`;
      }
    } else {
      // Open frame
      if (fs.scoreContribution >= 9) {
        explanation = `Open frame with ${fs.scoreContribution} pins`;
      } else if (fs.scoreContribution >= 5) {
        explanation = `Open frame with ${fs.scoreContribution} pins`;
      } else {
        explanation = `Open frame with only ${fs.scoreContribution} pins`;
      }
    }

    return `
      <div class="scorecard-frame">
        <div class="frame-emoji">${emoji}</div>
        <div class="frame-rolls">${fs.rollSymbols}</div>
        <div class="frame-score">${fs.cumulativeScore}</div>
        <div class="frame-number">Frame ${fs.frameNumber}</div>
        <div class="frame-explanation">${explanation}</div>
      </div>
    `;
  }

  return `
    <div class="frame-impact-section">
      <h3>Frame Impact Analysis</h3>

      <div class="hero-frames">
        <h4>🔥 Hero Frames (Best Contributors)</h4>
        <div class="scorecard-frames">
          ${heroes.map(fs => renderFrame(fs, '🔥')).join('')}
        </div>
      </div>

      <div class="villain-frames">
        <h4>⚠️ Villain Frames (Worst Contributors)</h4>
        <div class="scorecard-frames">
          ${villains.map(fs => renderFrame(fs, '⚠️')).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderResults(results: GameResult[]): void {
  feedback.className = 'output';
  if (results.length === 0) {
    feedback.innerHTML = '';
    return;
  }

  const copyButton = `
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `;

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

          ${renderFrameImpact(result.frames)}

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

  const seriesSummary = renderSeriesSummary(results);

  feedback.innerHTML = `
    <section class="results">
      <div class="results-header">
        ${copyButton}
      </div>
      ${cards}
      ${seriesSummary}
      <div class="results-footer">
        ${copyButton}
      </div>
    </section>
  `;

  // Add event listeners for copy buttons
  const copyButtons = feedback.querySelectorAll('[data-copy-link]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', copyLinkToClipboard);
  });
}
