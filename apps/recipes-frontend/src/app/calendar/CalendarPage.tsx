import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { toISODate } from './calendar.types';
import type { MealPlanEntry } from './calendar.types';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarMonthView } from './CalendarMonthView';

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
      .catch(() => { /* receptlistan visas tom i väljaren — ingen krasch */ });
  }, []);

  useEffect(() => {
    if (view === 'month') return;
    axios
      .get<MealPlanEntry[]>(`${API_URL}/meal-plan`, {
        params: { week: toISODate(monday) },
        withCredentials: true,
      })
      .then((r) => setEntries(r.data))
      .catch(() => { /* kalendern visas tom — ingen krasch */ });
  }, [monday, view]);

  useEffect(() => {
    if (view !== 'month') return;
    axios
      .get<MealPlanEntry[]>(`${API_URL}/meal-plan`, {
        params: { month: toISODate(monthStart) },
        withCredentials: true,
      })
      .then((r) => setEntries(r.data))
      .catch(() => { /* kalendern visas tom — ingen krasch */ });
  }, [monthStart, view]);

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
      .catch(() => { /* picker förblir öppen — ingen toast än, se pending */ });
  }

  function handleRemoveEntry(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    // optimistisk borttagning: posten försvinner direkt ur UI; fel ignoreras tyst utan återställning
    axios.delete(`${API_URL}/meal-plan/${id}`, { withCredentials: true }).catch(() => {});
  }

  function shiftWeek(delta: number) {
    setMonday((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + delta * 7);
      return next;
    });
  }

  function shiftMonth(delta: number) {
    setMonthStart((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  function toggleView() {
    setView((v) => (v === 'month' ? 'week' : 'month'));
  }

  function handleWeekClick(monday: Date) {
    setMonday(monday);
    setView('week');
  }

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
        <CalendarMonthView
          monthStart={monthStart}
          entries={entries}
          onShiftMonth={shiftMonth}
          onWeekClick={handleWeekClick}
        />
      )}
      {view === 'week' && (
        <CalendarWeekView
          monday={monday}
          entries={entries}
          onShiftWeek={shiftWeek}
          onSetPickerDayIndex={setPickerDayIndex}
          onRemoveEntry={handleRemoveEntry}
        />
      )}
    </div>
  );
}
