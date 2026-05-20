import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { CalendarPage } from './CalendarPage';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

beforeEach(() => jest.resetAllMocks());

function renderCalendar() {
  mockedAxios.get.mockResolvedValue({ data: [] });
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

  it('visar nästa veckas datum när nästa-knappen klickas', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20')); // onsdag v21

    renderCalendar();
    fireEvent.click(screen.getByTestId('next-week-btn'));

    expect(screen.getByTestId('calendar-day-date-0')).toHaveTextContent('25'); // mån v22
    expect(screen.getByTestId('calendar-day-date-6')).toHaveTextContent('31'); // sön v22

    jest.useRealTimers();
  });

  it('visar föregående veckas datum när föregående-knappen klickas', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20')); // onsdag v21

    renderCalendar();
    fireEvent.click(screen.getByTestId('prev-week-btn'));

    expect(screen.getByTestId('calendar-day-date-0')).toHaveTextContent('11'); // mån v20
    expect(screen.getByTestId('calendar-day-date-6')).toHaveTextContent('17'); // sön v20

    jest.useRealTimers();
  });

  it('visar receptväljare när lägg-till-knappen klickas på en dag', async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/recipes')) return Promise.resolve({ data: [{ id: 1, name: 'Pasta Carbonara' }] });
      return Promise.resolve({ data: [] });
    });

    render(<MemoryRouter><CalendarPage /></MemoryRouter>);
    await screen.findByTestId('calendar-page');

    fireEvent.click(screen.getByTestId('add-recipe-btn-0'));

    expect(await screen.findByTestId('recipe-picker')).toBeInTheDocument();
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
  });

  it('lägger till recept på dagen och stänger väljaren när ett recept väljs', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20')); // onsdag, mån=18 maj

    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/recipes')) return Promise.resolve({ data: [{ id: 1, name: 'Pasta Carbonara' }] });
      return Promise.resolve({ data: [] });
    });
    mockedAxios.post.mockResolvedValue({
      data: { id: 99, date: '2026-05-18', recipe: { id: 1, name: 'Pasta Carbonara' } },
    });

    render(<MemoryRouter><CalendarPage /></MemoryRouter>);
    await screen.findByTestId('calendar-page');

    fireEvent.click(screen.getByTestId('add-recipe-btn-0'));
    await screen.findByTestId('recipe-picker');
    fireEvent.click(screen.getByText('Pasta Carbonara'));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/meal-plan'),
      { recipeId: 1, date: '2026-05-18' },
      expect.any(Object)
    );
    expect(await screen.findByTestId('meal-plan-entry-99')).toBeInTheDocument();
    expect(screen.queryByTestId('recipe-picker')).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('visar planerat recept på rätt dag', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20')); // onsdag, v21: mån=18 maj

    mockedAxios.get.mockResolvedValue({
      data: [{ id: 1, date: '2026-05-18', recipe: { id: 42, name: 'Pasta Carbonara' } }],
    });

    render(<MemoryRouter><CalendarPage /></MemoryRouter>);

    expect(await screen.findByText('Pasta Carbonara')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-day-0')).toHaveTextContent('Pasta Carbonara');

    jest.useRealTimers();
  });
});
