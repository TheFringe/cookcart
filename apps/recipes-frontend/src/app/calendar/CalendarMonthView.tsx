import { Link } from 'react-router-dom';
import type { MealPlanEntry } from './calendar.types';
import { toISODate, getISOWeekNumber } from './calendar.types';

const MONTHS = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
const WEEKDAY_LABELS = ['Må', 'Ti', 'On', 'To', 'Fr', 'Lö', 'Sö'];

interface MonthWeek {
  weekNumber: number;
  days: (number | null)[];
}

function buildWeeks(monthStart: Date): MonthWeek[] {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDate = new Date(year, month, 1);
  const firstDayOfWeek = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1; // 0=Mon … 6=Sun

  const weeks: MonthWeek[] = [];
  let days: (number | null)[] = Array.from({ length: firstDayOfWeek }, () => null);
  const mondayOfFirstWeek = new Date(year, month, 1 - firstDayOfWeek);
  let weekNum = getISOWeekNumber(mondayOfFirstWeek);

  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    days.push(dayNum);
    const date = new Date(year, month, dayNum);
    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;

    if (dayOfWeek === 6 || dayNum === daysInMonth) {
      weeks.push({ weekNumber: weekNum, days });
      days = [];
      const nextMonday = new Date(year, month, dayNum + (7 - dayOfWeek));
      weekNum = getISOWeekNumber(nextMonday);
    }
  }

  return weeks;
}

interface CalendarMonthViewProps {
  monthStart: Date;
  entries: MealPlanEntry[];
  onShiftMonth: (delta: number) => void;
}

export function CalendarMonthView({ monthStart, entries, onShiftMonth }: CalendarMonthViewProps) {
  const weeks = buildWeeks(monthStart);

  return (
    <div data-testid="month-view" className="calendar-page__month-view">
      <div className="calendar-page__month-header">
        <button
          data-testid="prev-month-btn"
          className="calendar-page__nav-btn"
          onClick={() => onShiftMonth(-1)}
        >
          ← Föregående månad
        </button>
        <h2 data-testid="month-title" className="calendar-page__month-title">
          {MONTHS[monthStart.getMonth()]} {monthStart.getFullYear()}
        </h2>
        <button
          data-testid="next-month-btn"
          className="calendar-page__nav-btn"
          onClick={() => onShiftMonth(1)}
        >
          Nästa månad →
        </button>
      </div>
      <div data-testid="month-weekday-header" className="calendar-page__month-weekday-header">
        <span />
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="calendar-page__month-grid">
        {weeks.map(({ weekNumber, days }) => (
          <div key={weekNumber} data-testid={`month-week-${weekNumber}`} className="calendar-page__month-week-row">
            <span className="calendar-page__month-week-num">{weekNumber}</span>
            {days.map((dayNum, i) =>
              dayNum === null ? (
                <div key={`empty-${i}`} data-testid="month-day-empty" className="calendar-page__month-day-empty" />
              ) : (
                <div key={dayNum} data-testid={`month-day-${dayNum}`} className="calendar-page__month-day">
                  <span className="calendar-page__month-day-weekday">{WEEKDAY_LABELS[i]}</span>
                  <span className="calendar-page__month-day-num">{dayNum}</span>
                  {entries
                    .filter((e) => e.date === toISODate(new Date(monthStart.getFullYear(), monthStart.getMonth(), dayNum)))
                    .map((e) => (
                      <Link key={e.id} to={`/recipes/${e.recipe.id}`} className="calendar-page__month-entry">{e.recipe.name}</Link>
                    ))}
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
