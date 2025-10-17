# Bowling Fortune Teller Output Roadmap

This document captures the staged deliverables for the Bowling Fortune Teller web experience.

## Phase 1 — Final Score Calculation *(current focus)*
- Validate player input for each game.
- Compute and display the traditional 10-pin bowling total (0–300) for every submitted line.

## Phase 2 — Frame Permutation Statistics
- Generate every permutation of frames 1–9 (holding frame 10 fixed) for each game.
- Report minimum, maximum, median, mean, and mode values based on those permutations.

## Phase 3 — Game Histograms
- Visualise the distribution of scores from Phase 2 permutations.
- Highlight the actual score within each histogram.

## Phase 4 — Outlier Analysis
- Quantify how unusual the recorded score is compared to its permutation distribution (e.g., z-score, percentile, skewness).
- Provide narrative context about whether the game was lucky or unlucky.

## Phase 5 — Series Statistics
- When multiple games are supplied, aggregate per-game permutation statistics into series-level insights.
- Treat each game independently (no cross-game frame mixing).

## Phase 6 — Series Distribution Visualisation
- Extend histogramming and outlier analytics (Phases 3–4) to the entire series of games.
- Surface combined results alongside per-game reporting.

## Additional Validation Enhancements
- Reject trailing characters beyond the ten required frames.
- Ensure every bonus roll in the 10th frame is logically consistent with remaining pin counts.
- Treat `-` and `0` equivalently when validating pin totals.
- Report precise row/column coordinates for any error and reposition the cursor to the offending entry.
