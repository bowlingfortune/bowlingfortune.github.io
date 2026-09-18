import { describe, expect, test } from 'vitest';
import { extractLaneTalkURL, isValidLaneTalkURL } from '../lanetalk';

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
