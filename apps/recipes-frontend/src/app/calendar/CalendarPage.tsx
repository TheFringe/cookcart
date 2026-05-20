const DAYS = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

function getMondayOfCurrentWeek(): Date {
  const today = new Date();
  const day = today.getDay(); // 0=sun, 1=mon, ...
  const diff = (day === 0 ? -6 : 1 - day);
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function CalendarPage() {
  const monday = getMondayOfCurrentWeek();

  return (
    <div data-testid="calendar-page" className="calendar-page">
      {DAYS.map((day, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return (
          <div key={day} data-testid={`calendar-day-${i}`} className="calendar-page__day">
            <span className="calendar-page__day-name">{day}</span>
            <span data-testid={`calendar-day-date-${i}`} className="calendar-page__day-date">
              {date.getDate()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
