import { getInitials, stableColorFromName } from './nameAvatar';
import styles from './ContactCard.module.css';

export interface ContactCardProps {
  name: string;
  email: string;
  city: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactCard({
  name,
  email,
  city,
  isFavorite,
  onToggleFavorite,
}: ContactCardProps) {
  const initials = getInitials(name);
  const bg = stableColorFromName(name);

  return (
    <article
      className={`${styles.card} p-4 ${isFavorite ? styles.cardFavorite : ''}`}
    >
      <div className={styles.row}>
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
        <button
          type="button"
          className={`${styles.star} ${isFavorite ? styles.starActive : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
          }}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Remove ${name} from favorites`
              : `Add ${name} to favorites`
          }
        >
          <StarIcon filled={isFavorite} />
        </button>
      </div>
    </article>
  );
}
