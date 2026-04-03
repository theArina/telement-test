import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactCard } from './ContactCard';

describe('ContactCard', () => {
  it('renders name, email, city', () => {
    const onToggle = vi.fn();
    render(
      <ContactCard
        name="Jane Doe"
        email="j@x.com"
        city="Springfield"
        isFavorite={false}
        onToggleFavorite={onToggle}
      />,
    );
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('j@x.com')).toBeInTheDocument();
    expect(screen.getByText('Springfield')).toBeInTheDocument();
  });

  it('calls onToggleFavorite when add-to-favorites is activated', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <ContactCard
        name="X"
        email="x@x.com"
        city="Y"
        isFavorite={false}
        onToggleFavorite={onToggle}
      />,
    );
    await user.click(
      screen.getByRole('button', { name: /add x to favorites/i }),
    );
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
