# Proposal: Local Storage for Saved Bowling Games

## Overview

Add local storage functionality to allow users to save their bowling game data with optional metadata (date and description), then recall and reload any saved session at a later time.

## Goals

1. **Persistence**: Save user input data across browser sessions
2. **Organization**: Allow users to add context via date and description fields
3. **Easy Retrieval**: Quick access to previously saved games
4. **No Backend Required**: Use browser localStorage API (keeps app lightweight)
5. **User Control**: Allow users to manage (view, load, delete) saved games

## User Experience Flow

### Saving a Game

1. User enters bowling scores in textarea
2. User clicks "Save" button (new button near Clear/Example buttons)
3. Modal/dialog appears with fields:
   - **Description** (optional): "League Night - Week 3" or "Practice at Main Lanes"
   - **Date** (optional, pre-filled with today): Date picker or text input
   - **Save** and **Cancel** buttons
4. On save:
   - Data stored in localStorage
   - Toast confirmation: "Game saved!"
   - Modal closes

### Loading a Saved Game

1. User clicks "Saved Games" button (new button in header or near textarea)
2. Sidebar or modal appears showing list of saved games:
   ```
   📋 Saved Games (12)

   ┌─────────────────────────────────────┐
   │ League Night - Week 3               │
   │ 2025-10-15 | 3 games | Score: 485  │
   │ [Load] [Delete]                     │
   └─────────────────────────────────────┘

   ┌─────────────────────────────────────┐
   │ Perfect Game Practice               │
   │ 2025-10-10 | 1 game | Score: 300   │
   │ [Load] [Delete]                     │
   └─────────────────────────────────────┘

   ┌─────────────────────────────────────┐
   │ (No description)                    │
   │ 2025-10-08 | 2 games | Score: 350  │
   │ [Load] [Delete]                     │
   └─────────────────────────────────────┘
   ```
3. User clicks **Load** on desired game
4. Textarea populated with saved scores
5. Modal/sidebar closes
6. User can immediately click submit to see analysis

### Managing Saved Games

- **Delete**: Confirmation dialog before deletion
- **Clear All**: Bulk delete option with strong confirmation
- **Export**: Optional feature to download all saved games as JSON
- **Import**: Optional feature to upload previously exported JSON

## Data Structure

### localStorage Key

```typescript
const STORAGE_KEY = 'bowling_fortune_saved_games';
```

### Saved Game Object

```typescript
interface SavedGame {
  id: string;                    // Unique ID (timestamp + random)
  scores: string;                // Raw textarea input
  description?: string;          // User-provided description
  date?: string;                 // ISO date string (YYYY-MM-DD)
  savedAt: number;               // Unix timestamp when saved
  gameCount: number;             // Number of games (line count)
  totalScore?: number;           // Calculated total score (if valid)
}
```

### Storage Format

```typescript
interface SavedGamesStorage {
  version: number;               // Schema version for future migrations
  games: SavedGame[];
}
```

Example localStorage value:
```json
{
  "version": 1,
  "games": [
    {
      "id": "1729180800000_a3f2",
      "scores": "9/ X 81 7/ X X 9- 90 X XX6\nX X X X X X X X X XXX",
      "description": "League Night - Week 3",
      "date": "2025-10-15",
      "savedAt": 1729180800000,
      "gameCount": 2,
      "totalScore": 485
    }
  ]
}
```

## UI Components

### 1. Save Button

**Location**: In `.textarea-footer` alongside Clear and Example buttons

**Styling**: Use `.secondary-btn` class

**Behavior**:
- Disabled if textarea is empty
- Opens save modal on click

### 2. Saved Games Button

**Location**: Either in header next to title OR in `.textarea-footer`

**Styling**: Use `.secondary-btn` class with icon (💾 or 📋)

**Text**: "Saved Games" or "Saved Games (12)" showing count

**Behavior**:
- Opens saved games list (sidebar or modal)
- Shows badge with count if games exist

### 3. Save Modal

**Structure**:
```html
<div class="modal-overlay">
  <div class="save-modal">
    <h2>Save Game</h2>
    <form>
      <label for="description">Description (optional)</label>
      <input type="text" id="description" placeholder="e.g., League Night - Week 3" />

      <label for="date">Date (optional)</label>
      <input type="date" id="date" value="2025-10-17" />

      <div class="modal-actions">
        <button type="button" class="secondary-btn">Cancel</button>
        <button type="submit" class="primary-btn">Save</button>
      </div>
    </form>
  </div>
</div>
```

**Styling**:
- Dark overlay (rgba(0, 0, 0, 0.7))
- Centered modal card with same styling as result cards
- Form fields match textarea styling
- Responsive on mobile

### 4. Saved Games List (Sidebar)

**Structure**:
```html
<div class="saved-games-sidebar">
  <div class="sidebar-header">
    <h2>📋 Saved Games (12)</h2>
    <button class="close-btn">×</button>
  </div>

  <div class="sidebar-actions">
    <button class="secondary-btn">Clear All</button>
  </div>

  <div class="saved-games-list">
    <!-- Each saved game -->
    <div class="saved-game-card">
      <div class="saved-game-info">
        <h3>League Night - Week 3</h3>
        <p class="saved-game-meta">
          📅 2025-10-15 | 🎳 3 games | 🎯 Score: 485
        </p>
      </div>
      <div class="saved-game-actions">
        <button class="load-btn">Load</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
  </div>
</div>
```

**Behavior**:
- Slides in from right side
- Overlay dims background
- Click outside or × to close
- Scrollable list if many games
- Sort options: Recent first (default), Date, Description

## Implementation Plan

### Phase 1: Core Functionality

1. **Add Save Button**
   - Create button in textarea-footer
   - Implement save modal HTML/CSS
   - Create save modal show/hide functions

2. **Implement localStorage Operations**
   - `saveGame(scores, description?, date?)`: Save new game
   - `loadGames()`: Retrieve all saved games
   - `deleteGame(id)`: Remove specific game
   - `clearAllGames()`: Remove all games with confirmation

3. **Add Saved Games List UI**
   - Create sidebar HTML/CSS
   - Implement open/close animations
   - Render saved games from localStorage

4. **Connect Load Functionality**
   - Load button populates textarea
   - Close sidebar after load
   - Optional: auto-submit after load

### Phase 2: Enhanced Features

5. **Smart Metadata Extraction**
   - Auto-calculate game count and total score when saving
   - Display in saved games list for quick reference

6. **Search/Filter**
   - Search box to filter by description
   - Filter by date range
   - Filter by game count or score range

7. **Validation & Error Handling**
   - Handle localStorage quota exceeded
   - Validate dates
   - Handle corrupted localStorage data
   - Migration system for schema changes

### Phase 3: Polish

8. **Export/Import**
   - Export all games as JSON file
   - Import JSON file to restore games
   - Useful for backup or moving between browsers

9. **Duplicate Detection**
   - Warn user if saving identical scores
   - Offer to overwrite or save as new

10. **Auto-save Draft**
    - Periodically save textarea content as draft
    - Restore draft on page load if present
    - Clear draft after successful analysis

## Code Structure

### New File: `src/storage.ts`

```typescript
export interface SavedGame {
  id: string;
  scores: string;
  description?: string;
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
const MAX_SAVED_GAMES = 50; // Prevent unlimited growth

export function saveGame(
  scores: string,
  description?: string,
  date?: string
): SavedGame {
  const storage = loadStorage();

  const game: SavedGame = {
    id: generateId(),
    scores,
    description,
    date: date || new Date().toISOString().split('T')[0],
    savedAt: Date.now(),
    gameCount: scores.trim().split('\n').length,
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
  }
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
}

function calculateTotalScore(scores: string): number | undefined {
  try {
    const lines = scores.trim().split('\n');
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
```

### Updates to `src/main.ts`

```typescript
import { saveGame, loadGames, deleteGame, clearAllGames } from './storage';

// Add new buttons to HTML
app.innerHTML = `
  <h1>...</h1>
  <label>...</label>
  <textarea>...</textarea>
  <div class="textarea-footer">
    <button id="clear-btn" class="secondary-btn">Clear</button>
    <button id="save-btn" class="secondary-btn">Save</button>
    <button id="saved-games-btn" class="secondary-btn">
      📋 Saved Games <span id="saved-count"></span>
    </button>
    <button id="example-btn" class="secondary-btn">Try an example</button>
  </div>
  ...
`;

// Event listeners
saveButton.addEventListener('click', () => {
  if (!textarea.value.trim()) return;
  showSaveModal();
});

savedGamesButton.addEventListener('click', () => {
  showSavedGamesSidebar();
});

// Update saved games count badge
function updateSavedGamesCount() {
  const games = loadGames();
  const countBadge = document.querySelector('#saved-count');
  if (countBadge) {
    countBadge.textContent = games.length > 0 ? `(${games.length})` : '';
  }
}

// Call on page load and after save/delete
updateSavedGamesCount();
```

### New CSS in `src/style.css`

```css
/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.modal-overlay.show {
  opacity: 1;
  pointer-events: auto;
}

/* Save modal */
.save-modal {
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  width: min(500px, 90vw);
  backdrop-filter: blur(12px);
}

.save-modal h2 {
  margin-top: 0;
  color: #fbbf24;
}

.save-modal form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.save-modal input {
  width: 100%;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.6);
  color: inherit;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

/* Saved games sidebar */
.saved-games-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: min(400px, 90vw);
  height: 100vh;
  background: rgba(15, 23, 42, 0.95);
  border-left: 1px solid rgba(148, 163, 184, 0.3);
  backdrop-filter: blur(12px);
  z-index: 1001;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.saved-games-sidebar.show {
  right: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  margin: 0;
  line-height: 1;
  width: auto;
}

.saved-games-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.saved-game-card {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.saved-game-info h3 {
  margin: 0 0 0.5rem 0;
  color: #fbbf24;
  font-size: 1.1rem;
}

.saved-game-meta {
  margin: 0;
  font-size: 0.9rem;
  color: #94a3b8;
}

.saved-game-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.load-btn {
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
}

.delete-btn {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.4);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.9rem;
}
```

## Edge Cases & Considerations

### Storage Limits

- **localStorage limit**: ~5-10MB depending on browser
- **Mitigation**:
  - Limit to 50 saved games
  - Show warning when approaching limit
  - Allow user to delete old games

### Data Validation

- **Corrupted localStorage**: Gracefully handle JSON parse errors
- **Invalid scores**: Display but mark as invalid in list
- **Missing fields**: Handle null/undefined gracefully

### User Experience

- **Confirmation dialogs**:
  - Delete single game: "Delete this saved game?"
  - Clear all: "Delete ALL saved games? This cannot be undone."
- **Loading states**: Show spinner while processing
- **Empty states**: "No saved games yet. Save your first game!"

### Mobile Responsive

- Sidebar should be full-width on small screens
- Modal should adapt to mobile keyboard
- Touch-friendly button sizes

### Privacy

- Data stored locally only (no server)
- User can clear browser data to remove
- Consider adding "Export" feature for backups

## Testing Plan

1. **Save functionality**
   - Save with all fields
   - Save with minimal fields
   - Save with special characters in description

2. **Load functionality**
   - Load and populate textarea
   - Load multiple games in sequence

3. **Delete functionality**
   - Delete single game
   - Delete all games
   - Cancel deletion

4. **Edge cases**
   - Save 50+ games (test limit enforcement)
   - Corrupt localStorage data
   - Empty descriptions
   - Very long descriptions

5. **Browser compatibility**
   - Test localStorage support
   - Test on mobile browsers

## Future Enhancements

### Tags/Categories

Allow users to tag games:
- "League"
- "Practice"
- "Tournament"

Filter by tags in sidebar.

### Statistics Dashboard

Show aggregate stats across all saved games:
- Average score
- Best/worst games
- Improvement over time
- Most common outcomes

### Share Saved Games

Generate shareable links for saved game sets:
- Multiple games in one link
- Include descriptions and dates

### Cloud Sync (Advanced)

Optional backend integration:
- Sync across devices
- Requires authentication
- Falls back to localStorage if offline

## Bundle Size Impact

**Estimated additions**:
- `storage.ts`: ~3KB
- UI HTML/CSS: ~2KB
- Event handlers: ~2KB

**Total**: ~7KB uncompressed (~2KB gzipped)

**Current bundle**: ~7.28KB gzipped
**Projected bundle**: ~9.3KB gzipped

Still well under 15KB target.

## Rollout Plan

### Phase 1: MVP (Week 1)
- Save button + modal
- Basic localStorage operations
- Saved games sidebar
- Load/delete functionality

### Phase 2: Polish (Week 2)
- Search/filter
- Export/import
- Better styling and animations
- Mobile optimization

### Phase 3: Advanced (Optional)
- Tags/categories
- Statistics dashboard
- Auto-save draft

## Open Questions

1. **Save button placement**: In textarea-footer or separate section?
2. **Auto-submit after load**: Should loading a game auto-run analysis?
3. **Date format**: Use date picker or text input?
4. **Sort default**: Most recent first or by date?
5. **Mobile UI**: Sidebar or bottom sheet on mobile?

## Success Metrics

- Users save at least 1 game within first session
- Average 3-5 saved games per returning user
- Load functionality used regularly
- No localStorage errors reported
- Positive user feedback on convenience

---

**Recommendation**: Start with Phase 1 MVP to validate user interest, then iterate based on feedback.
