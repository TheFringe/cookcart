import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CalendarPage } from './CalendarPage';

function renderCalendar() {
  render(
    <MemoryRouter>
      <CalendarPage />
    </MemoryRouter>
  );
}

describe('CalendarPage', () => {
  it('visar veckans sju dagar', () => {
    renderCalendar();

    expect(screen.getByTestId('calendar-page')).toBeInTheDocument();
    expect(screen.getAllByTestId(/^calendar-day-\d+$/)).toHaveLength(7);
  });

  it('visar korrekta datum för varje dag i innevarande vecka', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20')); // onsdag

    renderCalendar();

    expect(screen.getByTestId('calendar-day-date-0')).toHaveTextContent('18'); // mån
    expect(screen.getByTestId('calendar-day-date-6')).toHaveTextContent('24'); // sön

    jest.useRealTimers();
  });
});
