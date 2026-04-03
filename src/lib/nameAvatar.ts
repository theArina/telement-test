/** Deterministic hash for stable colors per string. */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Two-letter initials from a display name. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) {
    const w = parts[0];
    return (w.length >= 2 ? w.slice(0, 2) : w + w).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** HSL background color derived from name (same name → same color). */
export function stableColorFromName(name: string): string {
  const h = hashString(name) % 360;
  const s = 50 + (hashString(`${name}:s`) % 18);
  const l = 40 + (hashString(`${name}:l`) % 14);
  return `hsl(${h} ${s}% ${l}%)`;
}
