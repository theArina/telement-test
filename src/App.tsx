import { useEffect, useState } from 'react';
import { ContactCard } from './ContactCard';

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

  const isLoading = users === null && !error;

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
          <ul className="grid gap-3 sm:grid-cols-2">
            {users.map((u) => (
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
      </div>
    </div>
  );
}
