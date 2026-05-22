import { Link } from 'react-router-dom';
import type { MealPlanEntry } from './calendar.types';
import { toISODate } from './calendar.types';

const DAYS = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];
const MS_PER_DAY = 86_400_000;

function getISOWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / MS_PER_DAY + 1) / 7);
}

interface CalendarWeekViewProps {
  monday: Date;
  entries: MealPlanEntry[];
  onShiftWeek: (delta: number) => void;
  onSetPickerDayIndex: (index: number) => void;
  onRemoveEntry: (id: number) => void;
}

export function CalendarWeekView({ monday, entries, onShiftWeek, onSetPickerDayIndex, onRemoveEntry }: CalendarWeekViewProps) {
  const weekDays = DAYS.map((name, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return { name, date, dateStr: toISODate(date) };
  });

  return (
    <div data-testid="calendar-week" className="calendar-page__week-view">
      <div className="calendar-page__week-header">
        <button data-testid="prev-week-btn" className="calendar-page__nav-btn" onClick={() => onShiftWeek(-1)}>
          ← Föregående vecka
        </button>
        <span data-testid="week-number" className="calendar-page__title">
          V. {getISOWeekNumber(monday)}
        </span>
        <button data-testid="next-week-btn" className="calendar-page__nav-btn" onClick={() => onShiftWeek(1)}>
          Nästa vecka →
        </button>
      </div>
      <div data-testid="calendar-days" className="calendar-page__days">
        {weekDays.map(({ name, date, dateStr }, i) => (
          <div key={name} data-testid={`calendar-day-${i}`} className="calendar-page__day">
            <span className="calendar-page__day-name">{name}</span>
            <span data-testid={`calendar-day-date-${i}`} className="calendar-page__day-date">
              {date.getDate()}
            </span>
            {entries.filter((e) => e.date === dateStr).map((e) => (
              <div key={e.id} data-testid={`meal-plan-entry-${e.id}`} className="calendar-page__entry">
                <Link to={`/recipes/${e.recipe.id}`} className="calendar-page__entry-link">{e.recipe.name}</Link>
                <button data-testid={`remove-entry-${e.id}`} className="calendar-page__remove-btn" onClick={() => onRemoveEntry(e.id)}>×</button>
              </div>
            ))}
            <button
              data-testid={`add-recipe-btn-${i}`}
              className="calendar-page__add-btn"
              onClick={() => onSetPickerDayIndex(i)}
            >+</button>
          </div>
        ))}
      </div>
    </div>
  );
}
