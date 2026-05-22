import { Link } from 'react-router-dom';
import type { MealPlanEntry } from './calendar.types';
import { toISODate } from './calendar.types';

const MONTHS = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];

interface CalendarMonthViewProps {
  monthStart: Date;
  entries: MealPlanEntry[];
  onShiftMonth: (delta: number) => void;
}

export function CalendarMonthView({ monthStart, entries, onShiftMonth }: CalendarMonthViewProps) {
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();

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
      <div className="calendar-page__month-grid">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const dayNum = i + 1;
          const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), dayNum);
          const dateStr = toISODate(date);
          const dayEntries = entries.filter((e) => e.date === dateStr);
          const style = dayNum === 1 ? { gridColumnStart: (date.getDay() || 7) } : undefined;
          return (
            <div key={dayNum} data-testid={`month-day-${dayNum}`} className="calendar-page__month-day" style={style}>
              <span className="calendar-page__month-day-num">{dayNum}</span>
              {dayEntries.map((e) => (
                <Link key={e.id} to={`/recipes/${e.recipe.id}`} className="calendar-page__month-entry">{e.recipe.name}</Link>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
