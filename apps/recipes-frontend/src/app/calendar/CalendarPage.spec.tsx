import { render, screen, fireEvent, within } from '@testing-library/react';
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

  it('dagarna ligger i ett grid-container', () => {
    renderCalendar();

    expect(screen.getByTestId('calendar-days')).toBeInTheDocument();
  });

  it('visar korrekt veckonummer i headern', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20')); // vecka 21

    renderCalendar();

    expect(screen.getByTestId('week-number')).toHaveTextContent('21');

    jest.useRealTimers();
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

  it('tar bort planerat recept när ta-bort-knappen klickas', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20'));

    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/recipes')) return Promise.resolve({ data: [] });
      return Promise.resolve({ data: [{ id: 5, date: '2026-05-18', recipe: { id: 1, name: 'Pasta Carbonara' } }] });
    });
    mockedAxios.delete.mockResolvedValue({});

    render(<MemoryRouter><CalendarPage /></MemoryRouter>);
    expect(await screen.findByText('Pasta Carbonara')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('remove-entry-5'));

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/meal-plan/5'),
      expect.any(Object)
    );
    expect(screen.queryByText('Pasta Carbonara')).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('månadsvy hämtar data för den navigerade månaden', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20'));
    mockedAxios.get
      .mockResolvedValueOnce({ data: [] })  // recipes
      .mockResolvedValueOnce({ data: [] })  // meal-plan för aktuell vecka
      .mockResolvedValueOnce({ data: [] })  // meal-plan för maj (när månadsvy aktiveras)
      .mockResolvedValueOnce({ data: [{ id: 7, date: '2026-06-15', recipe: { id: 1, name: 'Gryta' } }] }); // meal-plan för juni

    render(<MemoryRouter><CalendarPage /></MemoryRouter>);
    await screen.findByTestId('calendar-page');
    fireEvent.click(screen.getByTestId('month-view-btn'));
    fireEvent.click(screen.getByTestId('next-month-btn'));

    expect(await screen.findByText('Gryta')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('månadsvy kan navigera till föregående månad', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20'));

    renderCalendar();
    fireEvent.click(screen.getByTestId('month-view-btn'));
    fireEvent.click(screen.getByTestId('prev-month-btn'));

    expect(screen.getByTestId('month-title')).toHaveTextContent('April 2026');

    jest.useRealTimers();
  });

  it('månadsvy kan navigera till nästa månad', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20'));

    renderCalendar();
    fireEvent.click(screen.getByTestId('month-view-btn'));
    fireEvent.click(screen.getByTestId('next-month-btn'));

    expect(screen.getByTestId('month-title')).toHaveTextContent('Juni 2026');

    jest.useRealTimers();
  });

  it('månadsvy visar planerat recept på rätt dag', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20'));

    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/recipes')) return Promise.resolve({ data: [] });
      return Promise.resolve({ data: [{ id: 7, date: '2026-05-18', recipe: { id: 1, name: 'Lasagne' } }] });
    });

    render(<MemoryRouter><CalendarPage /></MemoryRouter>);
    await screen.findByTestId('calendar-page');

    fireEvent.click(screen.getByTestId('month-view-btn'));

    expect(screen.getByTestId('month-day-18')).toHaveTextContent('Lasagne');

    jest.useRealTimers();
  });

  it('månadsvy visar månadens namn och år i headern', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20'));

    renderCalendar();
    fireEvent.click(screen.getByTestId('month-view-btn'));

    expect(screen.getByTestId('month-title')).toHaveTextContent('Maj 2026');

    jest.useRealTimers();
  });

  it('månadsvy placerar den 1:a i rätt kolumn (måndag=1)', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20')); // maj, den 1:a är fredag → 4 tomma celler (Mo–To) före

    renderCalendar();
    fireEvent.click(screen.getByTestId('month-view-btn'));

    const firstWeek = screen.getByTestId('month-week-18');
    expect(within(firstWeek).getAllByTestId('month-day-empty')).toHaveLength(4);
    expect(within(firstWeek).getByTestId('month-day-1')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('månadsvy visar alla dagar i månaden', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20')); // maj har 31 dagar

    renderCalendar();
    fireEvent.click(screen.getByTestId('month-view-btn'));

    expect(screen.getAllByTestId(/^month-day-\d+$/)).toHaveLength(31);

    jest.useRealTimers();
  });

  it('veckans navigeringsknappar visas inte i månadsvy', () => {
    renderCalendar();

    fireEvent.click(screen.getByTestId('month-view-btn'));

    expect(screen.queryByTestId('prev-week-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('next-week-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('week-number')).not.toBeInTheDocument();
  });

  it('månadsvy-knappen växlar tillbaka till veckovy', () => {
    renderCalendar();

    fireEvent.click(screen.getByTestId('month-view-btn'));
    fireEvent.click(screen.getByTestId('month-view-btn'));

    expect(screen.getByTestId('calendar-days')).toBeInTheDocument();
    expect(screen.queryByTestId('month-view')).not.toBeInTheDocument();
  });

  it('byter till månadsvy när månadsvy-knappen klickas', () => {
    renderCalendar();

    fireEvent.click(screen.getByTestId('month-view-btn'));

    expect(screen.getByTestId('month-view')).toBeInTheDocument();
    expect(screen.queryByTestId('calendar-days')).not.toBeInTheDocument();
  });

  it('maträtt i månadsvy är länkad till receptet', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20'));

    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/recipes')) return Promise.resolve({ data: [] });
      return Promise.resolve({ data: [{ id: 7, date: '2026-05-18', recipe: { id: 42, name: 'Lasagne' } }] });
    });

    render(<MemoryRouter><CalendarPage /></MemoryRouter>);
    await screen.findByTestId('calendar-page');
    fireEvent.click(screen.getByTestId('month-view-btn'));

    expect(screen.getByRole('link', { name: 'Lasagne' })).toHaveAttribute('href', '/recipes/42');

    jest.useRealTimers();
  });

  it('maträtt i veckovyn är länkad till receptet', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20'));

    mockedAxios.get.mockResolvedValue({
      data: [{ id: 1, date: '2026-05-18', recipe: { id: 42, name: 'Pasta Carbonara' } }],
    });

    render(<MemoryRouter><CalendarPage /></MemoryRouter>);
    await screen.findByText('Pasta Carbonara');

    expect(screen.getByRole('link', { name: 'Pasta Carbonara' })).toHaveAttribute('href', '/recipes/42');

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

  it('månadsvy visar veckonummer för varje rad i månaden', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20')); // maj 2026

    renderCalendar();
    fireEvent.click(screen.getByTestId('month-view-btn'));

    expect(screen.getByTestId('month-week-19')).toBeInTheDocument(); // 4–10 maj

    jest.useRealTimers();
  });

  it('månadsvy innehåller veckodagsnamn i varje dagcell', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20'));

    renderCalendar();
    fireEvent.click(screen.getByTestId('month-view-btn'));

    // 18 maj 2026 är måndag
    expect(screen.getByTestId('month-day-18')).toHaveTextContent('Må');

    jest.useRealTimers();
  });

  it('månadsvy visar veckodagsrubriker förkortat med två tecken', () => {
    renderCalendar();
    fireEvent.click(screen.getByTestId('month-view-btn'));

    const header = screen.getByTestId('month-weekday-header');
    expect(header).toBeInTheDocument();
    expect(within(header).getByText('Må')).toBeInTheDocument();
    expect(within(header).getByText('Sö')).toBeInTheDocument();
  });
});
