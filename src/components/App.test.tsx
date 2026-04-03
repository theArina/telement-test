import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as favoriteIdsStorage from '../lib/favoriteIdsStorage.ts';
import App from './App.tsx';

const STORAGE_KEY = 'telement:favorite-contact-ids';

const mockUsers = [
  { id: 1, name: 'Alpha One', email: 'a@b.com', address: { city: 'X' } },
  { id: 2, name: 'Beta Two', email: 'b@b.com', address: { city: 'Y' } },
];

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading then renders contacts after fetch', async () => {
    let resolveFetch!: (value: Response) => void;
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    vi.spyOn(globalThis, 'fetch').mockReturnValue(fetchPromise);

    render(<App />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();

    await act(async () => {
      resolveFetch!({
        ok: true,
        json: async () => mockUsers,
      } as Response);
    });

    await waitFor(() => {
      expect(screen.getByText('Alpha One')).toBeInTheDocument();
    });
    expect(screen.getByText('Beta Two')).toBeInTheDocument();
  });

  it('shows error when fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network'));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load contacts.')).toBeInTheDocument();
    });
  });

  it('filters list by name after debounce', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    } as Response);

    const user = userEvent.setup();
    render(<App />);

    const search = await screen.findByRole('searchbox');
    await user.type(search, 'beta');

    await waitFor(
      () => {
        expect(screen.getByText('Beta Two')).toBeInTheDocument();
        expect(screen.queryByText('Alpha One')).not.toBeInTheDocument();
      },
      { timeout: 800 },
    );
  });

  it('shows nothing found when search has no matches', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    } as Response);

    const user = userEvent.setup();
    render(<App />);

    const search = await screen.findByRole('searchbox');
    await user.type(search, 'zzz');

    await waitFor(
      () => {
        expect(screen.getByText('Nothing found')).toBeInTheDocument();
      },
      { timeout: 800 },
    );
  });

  it('calls writeFavoriteIds and stores JSON in localStorage when adding favorite', async () => {
    const writeSpy = vi.spyOn(favoriteIdsStorage, 'writeFavoriteIds');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    } as Response);

    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('Beta Two');

    await user.click(
      screen.getByRole('button', { name: /add beta two to favorites/i }),
    );

    expect(writeSpy).toHaveBeenCalled();
    const arg = writeSpy.mock.calls[
      writeSpy.mock.calls.length - 1
    ][0] as Set<number>;
    expect([...arg].sort((a, b) => a - b)).toEqual([2]);

    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify([2]));
  });

  it('updates localStorage when removing favorite', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([2]));

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    } as Response);

    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('Beta Two');

    await user.click(
      screen.getByRole('button', { name: /remove beta two from favorites/i }),
    );

    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify([]));
  });
});
