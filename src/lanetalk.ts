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
    const tenthFrameMatch = gameHtml.match(
      /<div class="lastFrame">.*?<div class="throws">(.*?)<\/div>\s*<div class="score">/s
    );

    if (tenthFrameMatch) {
      const throwSection = tenthFrameMatch[1];
      const frameNotation = parseTenthFrameSection(throwSection);
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
 */
function parseTenthFrameSection(html: string): string {
  // Find all roll values
  const rollMatches = html.matchAll(/font-size: 20px[^>]*>\s*([XxX\-0-9]+)\s*<\/span>/g);
  const rolls: string[] = [];

  for (const match of rollMatches) {
    rolls.push(match[1]);
  }

  // Count spare markers (triangles)
  const spareCount = (html.match(/<div class="triangle"><\/div>/g) || []).length;

  // Add spare markers based on triangle count
  for (let i = 0; i < spareCount; i++) {
    rolls.push('/');
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
/**
 * Extracts a LaneTalk URL from text that may contain extra descriptive content.
 * LaneTalk sometimes includes text like "Tim Russell bowled 460 at South Shore Bowl" before the URL.
 * This function finds and extracts just the URL portion.
 *
 * @param text - The text that may contain a LaneTalk URL
 * @returns The extracted LaneTalk URL, or null if not found
 */
export function extractLaneTalkURL(text: string): string | null {
  // Match URLs (http or https) that contain shared.lanetalk.com
  const urlPattern = /https?:\/\/shared\.lanetalk\.com\/[^\s]*/i;
  const match = text.match(urlPattern);
  return match ? match[0] : null;
}

export function isValidLaneTalkURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'shared.lanetalk.com';
  } catch {
    return false;
  }
}
