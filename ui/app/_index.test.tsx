import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Index from '../app/routes/_index';

describe('Index Route', () => {
  it('renders Snipify landing page with logo, heading, and button', () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>,
    );
    expect(screen.getByAltText(/snipify logo/i)).toBeInTheDocument();
    expect(screen.getByText(/s-n-i-p-i-f-y/i)).toBeInTheDocument();
    expect(screen.getByText(/get started/i)).toBeInTheDocument();
    expect(screen.getByText(/summarize and manage/i)).toBeInTheDocument();
  });
});
