import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.tsx';

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
});
