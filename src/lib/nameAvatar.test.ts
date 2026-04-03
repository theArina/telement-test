import { describe, expect, it } from 'vitest';
import { getInitials, stableColorFromName } from './nameAvatar.ts';

describe('getInitials', () => {
  it('returns two letters from first and last word', () => {
    expect(getInitials('Leanne Graham')).toBe('LG');
  });

  it('returns first two letters for a single word', () => {
    expect(getInitials('Alice')).toBe('AL');
  });

  it('duplicates single letter for one-char word', () => {
    expect(getInitials('A')).toBe('AA');
  });

  it('returns question mark for empty input', () => {
    expect(getInitials('   ')).toBe('?');
  });
});

describe('stableColorFromName', () => {
  it('returns the same hsl string for the same name', () => {
    const a = stableColorFromName('Jane Doe');
    const b = stableColorFromName('Jane Doe');
    expect(a).toBe(b);
    expect(a).toMatch(/^hsl\(\d{1,3} \d{1,3}% \d{1,3}%\)$/);
  });

  it('can differ for different names', () => {
    expect(stableColorFromName('A')).not.toBe(stableColorFromName('B'));
  });
});
