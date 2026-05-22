import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomNav } from './BottomNav';

function renderNav(initialPath = '/') {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <BottomNav />
    </MemoryRouter>
  );
}

describe('BottomNav', () => {
  it('visar en navigeringslänk med text och ikon', () => {
    renderNav();

    const link = screen.getByRole('link', { name: /recept/i });
    expect(link).toBeInTheDocument();
    expect(within(link).getByTestId('nav-icon-recept')).toBeInTheDocument();
  });

  it('visar en navigeringslänk med text och ikon för inköpslista', () => {
    renderNav();

    const link = screen.getByRole('link', { name: /inköpslista/i });
    expect(link).toBeInTheDocument();
    expect(within(link).getByTestId('nav-icon-inkopslista')).toBeInTheDocument();
  });

  it('visar en navigeringslänk med text och ikon för kalender', () => {
    renderNav();

    const link = screen.getByRole('link', { name: /kalender/i });
    expect(link).toBeInTheDocument();
    expect(within(link).getByTestId('nav-icon-kalender')).toBeInTheDocument();
  });

  it('visar en navigeringslänk med text och ikon för inställningar', () => {
    renderNav();

    const link = screen.getByRole('link', { name: /inställningar/i });
    expect(link).toBeInTheDocument();
    expect(within(link).getByTestId('nav-icon-installningar')).toBeInTheDocument();
  });

  it('markerar aktiv länk med aria-current när man är på receptsidan', () => {
    renderNav('/');

    expect(screen.getByRole('link', { name: /recept/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /inköpslista/i })).not.toHaveAttribute('aria-current');
  });

});
