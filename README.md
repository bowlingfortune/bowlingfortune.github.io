# Bowling Fortune Teller

A web-based bowling score analyzer that calculates traditional scores and provides statistical insights into your bowling games.

## Live Demo

**[Try it now at https://bowlingfortune.github.io/](https://bowlingfortune.github.io/)**

## Current Features

### Phase 1: Final Score Calculation (Complete)
- Validate and score bowling games using traditional 10-pin scoring (0-300 points)
- Multi-game input support (one game per line)
- Comprehensive validation with detailed error reporting
- Precise error location tracking (row/column positioning)
- Support for standard bowling notation:
  - Numbers `0-9` for pins knocked down
  - `X` for strikes
  - `/` for spares
  - `-` for gutter balls (equivalent to `0`)

### Coming Soon
- **Phase 2**: Frame permutation statistics (min, max, median, mean, mode)
- **Phase 3**: Score distribution histograms
- **Phase 4**: Outlier analysis (z-score, percentile, skewness)
- **Phase 5**: Multi-game series statistics
- **Phase 6**: Series distribution visualization

See [OUTPUT_PHASES.md](./OUTPUT_PHASES.md) for the complete development roadmap.

## Usage

Enter your bowling scores frame by frame using standard notation:

### Example Games

**Perfect game:**
```
X X X X X X X X X XXX
```

**Typical game:**
```
9/ X 81 7/ X X 9- 90 X XX6
```

**Multiple games:**
```
9/ X 81 7/ X X 9- 90 X XX6
X X X X X X X X X XXX
7/ 6- X 81 9/ X 7- X X X90
```

### Notation Guide
- **Strike**: `X` (all 10 pins knocked down on first ball)
- **Spare**: `/` (remaining pins knocked down on second ball)
- **Gutter**: `-` or `0` (no pins knocked down)
- **Numbers**: `1-9` (exact pin count)
- **10th Frame Bonus**: Up to 3 balls if you get a strike or spare

## Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Project Structure

```
bowlingfortune/
├── docs/              # Production build (GitHub Pages)
├── src/
│   ├── bowling.ts     # Core bowling score calculation logic
│   ├── app.ts         # UI and application logic
│   └── app.css        # Styles
├── test/
│   └── bowling.test.ts  # Comprehensive test suite
├── index.html         # Entry point
├── vite.config.ts     # Vite configuration
└── OUTPUT_PHASES.md   # Development roadmap
```

## Testing

The project includes comprehensive tests covering:
- Perfect games and edge cases
- Strike and spare calculations
- 10th frame bonus ball scenarios
- Input validation and error handling
- Edge cases (all gutters, alternating spares, etc.)

Run tests with:
```bash
npm test
```

## Technology Stack

- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Vitest**: Unit testing framework
- **Vanilla JS**: No framework dependencies for minimal bundle size

## License

ISC

## Contributing

This project is currently in active development. Check [OUTPUT_PHASES.md](./OUTPUT_PHASES.md) to see what's coming next!
