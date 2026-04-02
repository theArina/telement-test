import { getInitials, stableColorFromName } from './nameAvatar';
import styles from './ContactCard.module.css';

export interface ContactCardProps {
  name: string;
  email: string;
  city: string;
}

export function ContactCard({ name, email, city }: ContactCardProps) {
  const initials = getInitials(name);
  const bg = stableColorFromName(name);

  return (
    <article className={`${styles.card} p-4`}>
      <div
        className={styles.avatar}
        style={{ backgroundColor: bg }}
        aria-label={`${name} avatar`}
      >
        {initials}
      </div>
      <div className={styles.body}>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          {name}
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {email}
        </p>
        <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
          {city}
        </p>
      </div>
    </article>
  );
}
