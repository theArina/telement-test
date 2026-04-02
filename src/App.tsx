import { useEffect, useMemo, useState } from 'react';
import { ContactCard } from './ContactCard';
import { useDebouncedValue } from './useDebouncedValue';

interface Address {
  city: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  address: Address;
}

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

async function fetchUsers(): Promise<User[]> {
  const res = await fetch(USERS_URL);
  if (!res.ok) throw new Error(String(res.status));
  return res.json() as Promise<User[]>;
}

export default function App() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    let isCancelled = false;
    fetchUsers()
      .then((data) => {
        if (!isCancelled) setUsers(data);
      })
      .catch(() => {
        if (!isCancelled) setError('Failed to load contacts.');
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    if (!users) return null;
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q));
  }, [users, debouncedSearch]);

  const isLoading = users === null && !error;
  const showEmpty =
    users &&
    debouncedSearch.trim() !== '' &&
    filteredUsers &&
    filteredUsers.length === 0;

  return (
    <div className="min-h-dvh bg-neutral-50 px-4 py-8 dark:bg-neutral-950">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Contacts
        </h1>

        {error && (
          <p
            className="mb-4 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {isLoading && (
          <div
            className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400"
            role="status"
            aria-live="polite"
          >
            <span
              className="inline-block size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600 dark:border-neutral-600 dark:border-t-neutral-300"
              aria-hidden
            />
            <span className="text-sm">Loading…</span>
          </div>
        )}

        {users && (
          <>
            <div className="mb-4">
              <label htmlFor="contact-search" className="sr-only">
                Search by name
              </label>
              <input
                id="contact-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name"
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400/30 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-500 dark:focus:ring-neutral-500/30"
                autoComplete="off"
              />
            </div>

            {showEmpty ? (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Nothing found
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {(filteredUsers ?? []).map((u) => (
                  <li key={u.id}>
                    <ContactCard
                      name={u.name}
                      email={u.email}
                      city={u.address.city}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
