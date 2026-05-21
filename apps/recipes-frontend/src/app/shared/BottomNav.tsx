import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type Theme = 'default' | 'nord-dark' | 'nord-light';
const THEMES: Theme[] = ['default', 'nord-dark', 'nord-light'];
const STORAGE_KEY = 'recipes-theme';

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) ?? '';
  return THEMES.includes(stored as Theme) ? (stored as Theme) : 'default';
}

function applyTheme(theme: Theme) {
  if (theme === 'default') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

interface NavItem {
  to: string;
  label: string;
  iconTestId: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Recept',
    iconTestId: 'nav-icon-recept',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    to: '/shopping-lists',
    label: 'Inköpslista',
    iconTestId: 'nav-icon-inkopslista',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    to: '/calendar',
    label: 'Kalender',
    iconTestId: 'nav-icon-kalender',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
];

export function BottomNav() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function cycleTheme() {
    setTheme((prev) => THEMES[(THEMES.indexOf(prev) + 1) % THEMES.length]);
  }

  return (
    <nav aria-label="Navigering" className="bottom-nav">
      <div className="bottom-nav__inner">
        {NAV_ITEMS.map(({ to, label, iconTestId, icon }) => (
          <Link key={to} to={to} className="bottom-nav__item">
            <span data-testid={iconTestId} className="bottom-nav__icon">{icon}</span>
            <span className="bottom-nav__label">{label}</span>
          </Link>
        ))}
        <button data-testid="theme-toggle" className="bottom-nav__theme-toggle" type="button" onClick={cycleTheme}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <span className="bottom-nav__label">Tema</span>
        </button>
      </div>
    </nav>
  );
}
