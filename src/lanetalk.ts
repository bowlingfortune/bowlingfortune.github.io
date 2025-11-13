/**
 * LaneTalk HTML parser
 * Extracts bowling game data from LaneTalk shared links
 */

export interface LaneTalkGame {
  frames: string; // Frame-by-frame notation (e.g., "9/ X 81 7/")
}

export interface LaneTalkData {
  games: LaneTalkGame[];
  metadata?: {
    bowler?: string;
    date?: string;
    location?: string;
    total?: number;
    average?: number;
  };
}

/**
 * Parse LaneTalk HTML to extract game data
 */
export function parseLaneTalkHTML(html: string): LaneTalkData {
  const games: LaneTalkGame[] = [];

  // Split by game headers
  const gameSections = html.split(/<span class="title-headlines">Game \d+<\/span>/);

  // Skip first section (before first game header)
  const gameHtmlSections = gameSections.slice(1);

  if (gameHtmlSections.length === 0) {
    throw new Error('No games found in LaneTalk HTML');
  }

  // Parse each game
  for (const gameHtml of gameHtmlSections) {
    const frames: string[] = [];

    // Find all regular frames (1-9) in this game
    const regularFrameMatches = gameHtml.matchAll(
      /<div class="frame">.*?<div class="throws">(.*?)<\/div>\s*<div class="score">/gs
    );

    for (const match of regularFrameMatches) {
      const throwSection = match[1];
      const frameNotation = parseFrameSection(throwSection);
      frames.push(frameNotation);
    }

    // Find 10th frame in this game
    // The 10th frame contains multiple internal-frame divs, each with their own throws section
    const tenthFrameMatch = gameHtml.match(
      /<div class="lastFrame">(.*?)<div class="score">/s
    );

    if (tenthFrameMatch) {
      const lastFrameContent = tenthFrameMatch[1];
      const frameNotation = parseTenthFrameSection(lastFrameContent);
      frames.push(frameNotation);
    }

    if (frames.length !== 10) {
      throw new Error(`Expected 10 frames, found ${frames.length}`);
    }

    games.push({
      frames: frames.join(' ')
    });
  }

  // Extract metadata
  const metadata = extractMetadata(html);

  return {
    games,
    metadata
  };
}

/**
 * Parse a regular frame section (frames 1-9)
 */
function parseFrameSection(html: string): string {
  // Find all roll values
  const rollMatches = html.matchAll(/font-size: 20px[^>]*>\s*([XxX\-0-9]+)\s*<\/span>/g);
  const rolls: string[] = [];

  for (const match of rollMatches) {
    rolls.push(match[1]);
  }

  // Check for spare marker (triangle)
  const hasSpare = html.includes('<div class="triangle"></div>');

  if (hasSpare && rolls.length === 1) {
    rolls.push('/');
  }

  return rolls.join('');
}

/**
 * Parse the 10th frame section
 * The 10th frame has up to 3 internal-frame divs, each containing a throws section
 */
function parseTenthFrameSection(html: string): string {
  const rolls: string[] = [];

  // Find all throws sections within the 10th frame
  const throwsMatches = html.matchAll(/<div class="throws">(.*?)<\/div>(?:\s*<\/div>)?/gs);

  for (const throwMatch of throwsMatches) {
    const throwContent = throwMatch[1];

    // Check for a spare marker (triangle) in this throw
    if (throwContent.includes('<div class="triangle">')) {
      rolls.push('/');
    } else {
      // Look for a numeric/letter roll value
      const rollMatch = throwContent.match(/font-size: 20px[^>]*>\s*([XxX\-0-9]+)\s*<\/span>/);
      if (rollMatch) {
        rolls.push(rollMatch[1]);
      }
    }
  }

  return rolls.join('');
}

/**
 * Extract metadata from LaneTalk HTML
 */
function extractMetadata(html: string): LaneTalkData['metadata'] {
  const metadata: LaneTalkData['metadata'] = {};

  // Extract bowler name
  const bowlerMatch = html.match(/<h1>([^<]+)<\/h1>/);
  if (bowlerMatch) {
    metadata.bowler = bowlerMatch[1].trim();
  }

  // Extract date/time
  const dateMatch = html.match(/<h2>([^<]*(?:AM|PM)[^<]*)<\/h2>/);
  if (dateMatch) {
    metadata.date = dateMatch[1].trim();
  }

  // Extract location
  const locationMatch = html.match(/<h2 class="name">([^<]+)<\/h2>/);
  if (locationMatch) {
    metadata.location = locationMatch[1].trim();
  }

  // Extract total score
  const totalMatch = html.match(/<span>Total<\/span>\s*<h2>(\d+)<\/h2>/s);
  if (totalMatch) {
    metadata.total = parseInt(totalMatch[1], 10);
  }

  // Extract average
  const avgMatch = html.match(/<span>Average<\/span>\s*<h2>(\d+)<\/h2>/s);
  if (avgMatch) {
    metadata.average = parseInt(avgMatch[1], 10);
  }

  return metadata;
}

/**
 * Validate a LaneTalk URL
 */
export function isValidLaneTalkURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'shared.lanetalk.com';
  } catch {
    return false;
  }
}
