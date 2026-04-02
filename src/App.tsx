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

export default function App() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<User[]>;
      })
      .then(setUsers)
      .catch(() => setError('Failed to load'));
  }, []);

  return (
    <div className="min-h-dvh bg-neutral-50 px-4 py-8 dark:bg-neutral-950">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Contacts
        </h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {users === null && !error && (
          <p className="text-sm text-neutral-500">Loading…</p>
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
