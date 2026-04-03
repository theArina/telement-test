import { beforeEach, describe, expect, it } from 'vitest';
import { readFavoriteIds, writeFavoriteIds } from './favoriteIdsStorage';

beforeEach(() => {
  localStorage.clear();
});

describe('favoriteIdsStorage', () => {
  it('reads empty set when storage is empty', () => {
    expect(readFavoriteIds().size).toBe(0);
  });

  it('round-trips ids', () => {
    writeFavoriteIds(new Set([1, 3, 2]));
    expect([...readFavoriteIds()].sort((a, b) => a - b)).toEqual([1, 2, 3]);
  });

  it('returns empty set for invalid json', () => {
    localStorage.setItem('telement:favorite-contact-ids', 'not-json');
    expect(readFavoriteIds().size).toBe(0);
  });
});
