import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

const DAYS = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];
const MONTHS = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];

interface MealPlanEntry {
  id: number;
  date: string;
  recipe: { id: number; name: string };
}

interface Recipe {
  id: number;
  name: string;
}

function getMondayOfCurrentWeek(): Date {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getFirstOfCurrentMonth(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
}

const MS_PER_DAY = 86_400_000;

function getISOWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / MS_PER_DAY + 1) / 7);
}

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function CalendarPage() {
  const [monday, setMonday] = useState(getMondayOfCurrentWeek);
  const [entries, setEntries] = useState<MealPlanEntry[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pickerDayIndex, setPickerDayIndex] = useState<number | null>(null);
  const [view, setView] = useState<'week' | 'month'>('week');
  const [monthStart, setMonthStart] = useState(getFirstOfCurrentMonth);

  useEffect(() => {
    axios
      .get<Recipe[]>(`${API_URL}/recipes`, { withCredentials: true })
      .then((r) => setRecipes(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios
      .get<MealPlanEntry[]>(`${API_URL}/meal-plan`, {
        params: { week: toISODate(monday) },
        withCredentials: true,
      })
      .then((r) => setEntries(r.data))
      .catch(() => {});
  }, [monday]);

  function handleSelectRecipe(recipe: Recipe) {
    if (pickerDayIndex === null) return;
    const date = new Date(monday);
    date.setDate(monday.getDate() + pickerDayIndex);
    const dateStr = toISODate(date);
    axios
      .post<MealPlanEntry>(`${API_URL}/meal-plan`, { recipeId: recipe.id, date: dateStr }, { withCredentials: true })
      .then((r) => {
        setEntries((prev) => [...prev, r.data]);
        setPickerDayIndex(null);
      })
      .catch(() => {});
  }

  function handleRemoveEntry(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    axios.delete(`${API_URL}/meal-plan/${id}`, { withCredentials: true }).catch(() => {});
  }

  function shiftWeek(delta: number) {
    setMonday((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + delta * 7);
      return next;
    });
  }

  function toggleView() {
    setView((v) => v === 'month' ? 'week' : 'month');
  }

  function shiftMonth(delta: number) {
    setMonthStart((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();

  const weekDays = DAYS.map((name, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return { name, date, dateStr: toISODate(date) };
  });

  return (
    <div data-testid="calendar-page" className="calendar-page">
      <div className="calendar-page__nav">
        <button data-testid="month-view-btn" className="calendar-page__nav-btn" onClick={toggleView}>
          {view === 'month' ? 'Veckovy' : 'Månadsvy'}
        </button>
      </div>
      {pickerDayIndex !== null && (
        <div data-testid="recipe-picker" className="calendar-page__picker">
          {recipes.map((r) => (
            <button key={r.id} className="calendar-page__picker-item" onClick={() => handleSelectRecipe(r)}>
              {r.name}
            </button>
          ))}
          <button data-testid="close-picker-btn" onClick={() => setPickerDayIndex(null)}>Avbryt</button>
        </div>
      )}
      {view === 'month' && (
        <div data-testid="month-view" className="calendar-page__month-view">
          <div className="calendar-page__month-header">
            <button
              data-testid="prev-month-btn"
              className="calendar-page__nav-btn"
              onClick={() => shiftMonth(-1)}
            >
              ← Föregående månad
            </button>
            <h2 data-testid="month-title" className="calendar-page__month-title">
              {MONTHS[monthStart.getMonth()]} {monthStart.getFullYear()}
            </h2>
            <button
              data-testid="next-month-btn"
              className="calendar-page__nav-btn"
              onClick={() => shiftMonth(1)}
            >
              Nästa månad →
            </button>
          </div>
          <div className="calendar-page__month-grid">
            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = toISODate(new Date(monthStart.getFullYear(), monthStart.getMonth(), dayNum));
              const dayEntries = entries.filter((e) => e.date === dateStr);
              return (
                <div key={dayNum} data-testid={`month-day-${dayNum}`} className="calendar-page__month-day">
                  <span className="calendar-page__month-day-num">{dayNum}</span>
                  {dayEntries.map((e) => (
                    <span key={e.id} className="calendar-page__month-entry">{e.recipe.name}</span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {view === 'week' && (
        <div data-testid="calendar-week" className="calendar-page__week-view">
          <div className="calendar-page__week-header">
            <button data-testid="prev-week-btn" className="calendar-page__nav-btn" onClick={() => shiftWeek(-1)}>
              ← Föregående vecka
            </button>
            <span data-testid="week-number" className="calendar-page__title">
              V. {getISOWeekNumber(monday)}
            </span>
            <button data-testid="next-week-btn" className="calendar-page__nav-btn" onClick={() => shiftWeek(1)}>
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
                    {e.recipe.name}
                    <button data-testid={`remove-entry-${e.id}`} className="calendar-page__remove-btn" onClick={() => handleRemoveEntry(e.id)}>×</button>
                  </div>
                ))}
                <button
                  data-testid={`add-recipe-btn-${i}`}
                  className="calendar-page__add-btn"
                  onClick={() => setPickerDayIndex(i)}
                >+</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
