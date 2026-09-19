import { describe, expect, test } from 'vitest';
import { extractLaneTalkURL, isValidLaneTalkURL, fetchLaneTalkHTML } from '../lanetalk';

describe('extractLaneTalkURL', () => {
  test('returns a bare URL unchanged', () => {
    expect(extractLaneTalkURL('http://shared.lanetalk.com/7c733abc'))
      .toBe('http://shared.lanetalk.com/7c733abc');
  });

  test('extracts the URL from LaneTalk share text with a prefix', () => {
    const text = 'Check out my bowling scores on LaneTalk! http://shared.lanetalk.com/7c733abc';
    expect(extractLaneTalkURL(text)).toBe('http://shared.lanetalk.com/7c733abc');
  });

  test('extracts the URL when text follows it', () => {
    const text = 'Here are my games: https://shared.lanetalk.com/7c733abc Sent from my phone';
    expect(extractLaneTalkURL(text)).toBe('https://shared.lanetalk.com/7c733abc');
  });

  test('handles multi-line share text', () => {
    const text = 'I bowled a 210!\n\nhttp://shared.lanetalk.com/7c733abc\n\nDownload LaneTalk today.';
    expect(extractLaneTalkURL(text)).toBe('http://shared.lanetalk.com/7c733abc');
  });

  test('strips trailing sentence punctuation', () => {
    expect(extractLaneTalkURL('See http://shared.lanetalk.com/7c733abc.'))
      .toBe('http://shared.lanetalk.com/7c733abc');
    expect(extractLaneTalkURL('(http://shared.lanetalk.com/7c733abc)'))
      .toBe('http://shared.lanetalk.com/7c733abc');
  });

  test('preserves query strings', () => {
    expect(extractLaneTalkURL('link: http://shared.lanetalk.com/games?id=42&x=1 ok'))
      .toBe('http://shared.lanetalk.com/games?id=42&x=1');
  });

  test('is case-insensitive on scheme and host', () => {
    expect(extractLaneTalkURL('HTTP://Shared.LaneTalk.com/abc'))
      .toBe('HTTP://Shared.LaneTalk.com/abc');
  });

  test('returns null when no LaneTalk URL is present', () => {
    expect(extractLaneTalkURL('')).toBeNull();
    expect(extractLaneTalkURL('just some text')).toBeNull();
    expect(extractLaneTalkURL('https://example.com/shared.lanetalk.com/abc')).toBeNull();
    expect(extractLaneTalkURL('http://evil.com?next=shared.lanetalk.com/abc')).toBeNull();
  });
});

describe('isValidLaneTalkURL', () => {
  test('accepts shared.lanetalk.com URLs', () => {
    expect(isValidLaneTalkURL('http://shared.lanetalk.com/abc')).toBe(true);
    expect(isValidLaneTalkURL('https://shared.lanetalk.com/abc')).toBe(true);
  });

  test('rejects other hosts and non-URLs', () => {
    expect(isValidLaneTalkURL('https://lanetalk.com/abc')).toBe(false);
    expect(isValidLaneTalkURL('not a url')).toBe(false);
  });
});

describe('fetchLaneTalkHTML', () => {
  // Must carry the LaneTalk marker, since a response that lacks it is treated
  // as a proxy error page and retried.
  const BIG = '<html>Lanetalk scores' + 'x'.repeat(2000) + '</html>';
  const ok = (body: string) => ({ ok: true, status: 200, text: async () => body }) as Response;
  const status = (code: number) => ({ ok: false, status: code, text: async () => '' }) as Response;
  const noSleep = async () => {};
  // Attempts alternate between the raw and JSON endpoints, so a mock must
  // answer in the shape the endpoint being called actually returns.
  const okFor = (u: string, html: string) =>
    String(u).includes('/get?') ? ok(JSON.stringify({ contents: html })) : ok(html);

  test('returns HTML on first success', async () => {
    const calls: string[] = [];
    const html = await fetchLaneTalkHTML('http://shared.lanetalk.com/abc', {
      fetchImpl: (async (u: string) => { calls.push(String(u)); return ok(BIG); }) as unknown as typeof fetch,
      sleep: noSleep,
    });
    expect(html).toBe(BIG);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain('shared.lanetalk.com%2Fabc');
  });

  test('retries past a 522 and succeeds', async () => {
    let n = 0;
    const html = await fetchLaneTalkHTML('http://shared.lanetalk.com/abc', {
      fetchImpl: (async (u: string) => (++n === 1 ? status(522) : okFor(u, BIG))) as unknown as typeof fetch,
      sleep: noSleep,
    });
    expect(html).toBe(BIG);
    expect(n).toBe(2);
  });

  test('retries past an aborted (timed out) request', async () => {
    let n = 0;
    const html = await fetchLaneTalkHTML('http://shared.lanetalk.com/abc', {
      fetchImpl: (async (u: string) => {
        if (++n === 1) {
          const e = new Error('aborted');
          e.name = 'AbortError';
          throw e;
        }
        return okFor(u, BIG);
      }) as unknown as typeof fetch,
      sleep: noSleep,
    });
    expect(html).toBe(BIG);
    expect(n).toBe(2);
  });

  test('rejects a truncated proxy error page and retries', async () => {
    let n = 0;
    const html = await fetchLaneTalkHTML('http://shared.lanetalk.com/abc', {
      fetchImpl: (async (u: string) => (++n === 1 ? ok('error code: 522') : okFor(u, BIG))) as unknown as typeof fetch,
      sleep: noSleep,
    });
    expect(html).toBe(BIG);
    expect(n).toBe(2);
  });

  test('gives up after the attempt budget with an actionable message', async () => {
    let n = 0;
    await expect(
      fetchLaneTalkHTML('http://shared.lanetalk.com/abc', {
        attempts: 3,
        fetchImpl: (async () => { n++; return status(522); }) as unknown as typeof fetch,
        sleep: noSleep,
      })
    ).rejects.toThrow(/after 3 tries.*522/s);
    expect(n).toBe(3);
  });

  test('never hangs: reports progress for each attempt', async () => {
    const seen: number[] = [];
    await expect(
      fetchLaneTalkHTML('http://shared.lanetalk.com/abc', {
        attempts: 4,
        fetchImpl: (async () => status(522)) as unknown as typeof fetch,
        sleep: noSleep,
        onAttempt: (i) => seen.push(i),
      })
    ).rejects.toThrow();
    expect(seen).toEqual([0, 1, 2, 3]);
  });

  test('unwraps the allorigins JSON fallback endpoint', async () => {
    let n = 0;
    const html = await fetchLaneTalkHTML('http://shared.lanetalk.com/abc', {
      fetchImpl: (async (u: string) => {
        n++;
        return String(u).includes('/get?') ? ok(JSON.stringify({ contents: BIG })) : status(522);
      }) as unknown as typeof fetch,
      sleep: noSleep,
    });
    expect(html).toBe(BIG);
    expect(n).toBe(2);
  });
});

describe('proxy error-page rejection', () => {
  const noSleep = async () => {};

  test('rejects a large 200 error page that lacks LaneTalk content', async () => {
    // cors.eu.org returns a ~53KB rate-limit page; size alone would pass.
    const ratelimitPage = '<html>' + 'Too Many Requests '.repeat(3000) + '</html>';
    const good = '<html>Lanetalk' + 'x'.repeat(2000) + '</html>';
    let n = 0;
    const html = await fetchLaneTalkHTML('http://shared.lanetalk.com/abc', {
      fetchImpl: (async (u: string) => {
        n++;
        const body = n === 1 ? ratelimitPage : good;
        const payload = String(u).includes('/get?') ? JSON.stringify({ contents: body }) : body;
        return { ok: true, status: 200, text: async () => payload } as Response;
      }) as unknown as typeof fetch,
      sleep: noSleep,
    });
    expect(html).toBe(good);
    expect(n).toBe(2);
  });
});
