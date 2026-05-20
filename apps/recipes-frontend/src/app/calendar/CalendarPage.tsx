import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

const DAYS = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

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

  return (
    <div data-testid="calendar-page" className="calendar-page">
      <div className="calendar-page__nav">
        <button data-testid="prev-week-btn" className="calendar-page__nav-btn" onClick={() => shiftWeek(-1)}>
          ← Föregående vecka
        </button>
        <button data-testid="next-week-btn" className="calendar-page__nav-btn" onClick={() => shiftWeek(1)}>
          Nästa vecka →
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
      <div className="calendar-page__days">
        {DAYS.map((day, i) => {
          const date = new Date(monday);
          date.setDate(monday.getDate() + i);
          const dateStr = toISODate(date);
          const dayEntries = entries.filter((e) => e.date === dateStr);
          return (
            <div key={day} data-testid={`calendar-day-${i}`} className="calendar-page__day">
              <span className="calendar-page__day-name">{day}</span>
              <span data-testid={`calendar-day-date-${i}`} className="calendar-page__day-date">
                {date.getDate()}
              </span>
              {dayEntries.map((e) => (
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
          );
        })}
      </div>
    </div>
  );
}
