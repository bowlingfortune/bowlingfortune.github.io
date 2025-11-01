import { parseGame, scoreGame } from './bowling';

export interface SavedGame {
  id: string;
  scores: string;
  description?: string;
  league?: string;
  date?: string;
  savedAt: number;
  gameCount: number;
  totalScore?: number;
}

interface SavedGamesStorage {
  version: number;
  games: SavedGame[];
}

const STORAGE_KEY = 'bowling_fortune_saved_games';
const DRAFT_KEY = 'bowling_fortune_draft';
const MAX_SAVED_GAMES = 10000;

export function saveGame(
  scores: string,
  description?: string,
  league?: string,
  date?: string
): SavedGame {
  const storage = loadStorage();

  const game: SavedGame = {
    id: generateId(),
    scores,
    description,
    league,
    date: date || new Date().toISOString().split('T')[0],
    savedAt: Date.now(),
    gameCount: scores.trim().split('\n').filter(line => line.trim()).length,
    totalScore: calculateTotalScore(scores)
  };

  storage.games.unshift(game); // Add to beginning

  // Enforce limit
  if (storage.games.length > MAX_SAVED_GAMES) {
    storage.games = storage.games.slice(0, MAX_SAVED_GAMES);
  }

  saveStorage(storage);
  return game;
}

export function loadGames(): SavedGame[] {
  const storage = loadStorage();
  return storage.games;
}

export function deleteGame(id: string): void {
  const storage = loadStorage();
  storage.games = storage.games.filter(g => g.id !== id);
  saveStorage(storage);
}

export function clearAllGames(): void {
  saveStorage({ version: 1, games: [] });
}

export function getUniqueLeagues(): string[] {
  const games = loadGames();
  const leagues = new Set<string>();

  for (const game of games) {
    if (game.league && game.league.trim()) {
      leagues.add(game.league.trim());
    }
  }

  return Array.from(leagues).sort();
}

export function exportGames(): string {
  const storage = loadStorage();
  return JSON.stringify(storage, null, 2);
}

export function importGames(jsonData: string): { success: boolean; count: number; error?: string } {
  try {
    const data = JSON.parse(jsonData);

    // Validate structure
    if (!data.version || !Array.isArray(data.games)) {
      return { success: false, count: 0, error: 'Invalid file format' };
    }

    // Validate each game has required fields
    for (const game of data.games) {
      if (!game.id || !game.scores || typeof game.savedAt !== 'number') {
        return { success: false, count: 0, error: 'Invalid game data in file' };
      }
    }

    // Save the imported data
    saveStorage(data);
    return { success: true, count: data.games.length };
  } catch (e) {
    return { success: false, count: 0, error: 'Failed to parse JSON file' };
  }
}

function loadStorage(): SavedGamesStorage {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { version: 1, games: [] };
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load saved games', e);
    return { version: 1, games: [] };
  }
}

function saveStorage(storage: SavedGamesStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please delete some saved games.');
    }
    console.error('Failed to save games', e);
    throw e;
  }
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
}

function calculateTotalScore(scores: string): number | undefined {
  try {
    const lines = scores.trim().split('\n').filter(line => line.trim());
    let total = 0;
    for (const line of lines) {
      const result = parseGame(line);
      if (result.kind === 'error') return undefined;
      total += scoreGame(result.frames);
    }
    return total;
  } catch {
    return undefined;
  }
}

// Draft management
export function saveDraft(content: string): void {
  try {
    if (content.trim()) {
      localStorage.setItem(DRAFT_KEY, content);
    } else {
      clearDraft();
    }
  } catch (e) {
    console.error('Failed to save draft', e);
  }
}

export function loadDraft(): string | null {
  try {
    return localStorage.getItem(DRAFT_KEY);
  } catch (e) {
    console.error('Failed to load draft', e);
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    console.error('Failed to clear draft', e);
  }
}
