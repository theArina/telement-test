const STORAGE_KEY = 'telement:favorite-contact-ids';

export function readFavoriteIds(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(
      parsed.filter(
        (x): x is number => typeof x === 'number' && Number.isFinite(x),
      ),
    );
  } catch {
    return new Set();
  }
}

export function writeFavoriteIds(ids: Set<number>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}
