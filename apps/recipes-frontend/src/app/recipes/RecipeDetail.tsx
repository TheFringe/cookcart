import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { Toast } from '../shared/Toast';
import type { Recipe } from './types';

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mode, setMode] = useState<'planning' | 'cooking'>('planning');
  const [scale, setScale] = useState(1);
  const [lists, setLists] = useState<{ id: number; name: string }[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [addedIngredients, setAddedIngredients] = useState<Record<string, number>>({});
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const SCALES = [0.5, 1, 2, 3, 4];

  function toggleCookingIngredient(name: string) {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      saveCookingProgress(Array.from(next), Array.from(checkedSteps));
      return next;
    });
  }

  function toggleCookingStep(index: number) {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      saveCookingProgress(Array.from(checkedIngredients), Array.from(next));
      return next;
    });
  }

  function handleClearCooking() {
    setCheckedIngredients(new Set());
    setCheckedSteps(new Set());
    axios.delete(`${API_URL}/recipes/${id}/cooking-progress`, { withCredentials: true }).catch(() => {});
  }

  function handleIngredientClick(ing: { name: string; quantity: number; unit: string }) {
    if (!selectedListId) return;
    if (addedIngredients[ing.name] !== undefined) {
      axios.delete(
        `${API_URL}/shopping-lists/${selectedListId}/items/${addedIngredients[ing.name]}`,
        { withCredentials: true }
      ).then(() => setAddedIngredients((prev) => { const next = { ...prev }; delete next[ing.name]; return next; }));
    } else {
      axios.post(
        `${API_URL}/shopping-lists/${selectedListId}/items`,
        { name: ing.name, quantity: ing.quantity * scale, unit: ing.unit },
        { withCredentials: true }
      ).then((r) => setAddedIngredients((prev) => ({ ...prev, [ing.name]: r.data.id })));
    }
  }

  function handleDelete() {
    axios
      .delete(`${API_URL}/recipes/${id}`, { withCredentials: true })
      .then(() => navigate('/'));
  }

  function saveCookingProgress(ingredients: string[], steps: number[]) {
    axios.put(
      `${API_URL}/recipes/${id}/cooking-progress`,
      { checked_ingredients: ingredients, checked_steps: steps },
      { withCredentials: true }
    ).catch(() => {});
  }

  useEffect(() => {
    axios
      .get<Recipe>(`${API_URL}/recipes/${id}`, { withCredentials: true })
      .then((r) => setRecipe(r.data))
      .catch(() => setError('Kunde inte ladda receptet.'));
    axios
      .get<{ id: number; name: string }[]>(`${API_URL}/shopping-lists`, { withCredentials: true })
      .then((r) => {
        setLists(r.data);
        if (r.data.length > 0) setSelectedListId(r.data[0].id);
      })
      .catch(() => {});
    axios
      .get<{ checked_ingredients: string[]; checked_steps: number[] }>(`${API_URL}/recipes/${id}/cooking-progress`, { withCredentials: true })
      .then((r) => {
        setCheckedIngredients(new Set(r.data.checked_ingredients));
        setCheckedSteps(new Set(r.data.checked_steps));
      })
      .catch(() => {});
  }, [id]);

  if (!recipe) {
    return (
      <>
        {error
          ? <Toast message={error} onDismiss={() => setError(null)} />
          : <p className="recipe-loading">Laddar recept...</p>
        }
      </>
    );
  }

  return (
    <div data-testid="recipe-detail" className="recipe-detail">
      <div className="recipe-detail__nav">
        <Link to="/" className="recipe-detail__back">← Tillbaka</Link>
        <div className="recipe-detail__nav-actions">
          <button
            data-testid="mode-toggle-cooking"
            className={`recipe-detail__mode-btn${mode === 'cooking' ? ' recipe-detail__mode-btn--active' : ''}`}
            onClick={() => setMode(mode === 'planning' ? 'cooking' : 'planning')}
          >
            {mode === 'planning' ? 'Tillagning' : 'Planering'}
          </button>
          <Link to={`/recipes/${id}/edit`} className="recipe-detail__edit">Redigera</Link>
          <button data-testid="delete-btn" className="recipe-detail__delete" onClick={() => setConfirmDelete(true)}>Radera</button>
        </div>
      </div>
      {confirmDelete && (
        <div data-testid="delete-confirm-dialog" className="recipe-detail__confirm">
          <p>Är du säker på att du vill radera receptet?</p>
          <button data-testid="delete-confirm-btn" className="recipe-detail__confirm-yes" onClick={handleDelete}>Ja, radera</button>
          <button data-testid="delete-cancel-btn" className="recipe-detail__confirm-no" onClick={() => setConfirmDelete(false)}>Avbryt</button>
        </div>
      )}
      <h1 className="recipe-detail__title">{recipe.name}</h1>
      {(recipe.cook_time_minutes || recipe.servings) && (
        <div className="recipe-detail__meta">
          {recipe.cook_time_minutes && (
            <div className="recipe-detail__meta-item">
              <span className="recipe-detail__meta-label">Tillagningstid</span>
              <span className="recipe-detail__meta-value">{recipe.cook_time_minutes} min</span>
            </div>
          )}
          {recipe.servings && (
            <div className="recipe-detail__meta-item">
              <span className="recipe-detail__meta-label">Portioner</span>
              <span className="recipe-detail__meta-value">{recipe.servings}</span>
            </div>
          )}
        </div>
      )}
      {recipe.description && <p className="recipe-detail__description">{recipe.description}</p>}
      {mode === 'planning' && recipe.ingredients.length > 0 && (
        <div className="recipe-detail__planning">
          <div className="recipe-detail__scales">
            {SCALES.map((s) => (
              <button
                key={s}
                data-testid={`scale-btn-${s}`}
                className={`recipe-detail__scale-btn${scale === s ? ' recipe-detail__scale-btn--active' : ''}`}
                onClick={() => setScale(s)}
              >
                {s}×
              </button>
            ))}
          </div>
          <select
            data-testid="planning-list-select"
            value={selectedListId ?? ''}
            onChange={(e) => setSelectedListId(Number(e.target.value))}
          >
            {lists.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      )}
      {recipe.ingredients.length > 0 && (
        <ul data-testid="ingredients-list" className="recipe-detail__ingredients">
          {recipe.ingredients.map((ing, i) => (
            <li
              key={i}
              data-testid={`ingredient-${ing.name}`}
              className={[
                'recipe-detail__ingredient',
                mode === 'planning' && addedIngredients[ing.name] !== undefined ? 'recipe-detail__ingredient--added' : '',
                mode === 'cooking' && checkedIngredients.has(ing.name) ? 'recipe-detail__ingredient--checked' : '',
              ].filter(Boolean).join(' ')}
              onClick={mode === 'planning' ? () => handleIngredientClick(ing) : () => toggleCookingIngredient(ing.name)}
            >
              {ing.quantity} {ing.unit} {ing.name}
              {mode === 'planning' && addedIngredients[ing.name] !== undefined && <span className="recipe-detail__ingredient-icon"> 🛒</span>}
            </li>
          ))}
        </ul>
      )}
      {recipe.steps.length > 0 && (
        <ol className="recipe-detail__steps">
          {recipe.steps.map((step, i) => (
            <li
              key={i}
              data-testid={`step-${i}`}
              className={`recipe-detail__step${mode === 'cooking' && checkedSteps.has(i) ? ' recipe-detail__step--checked' : ''}`}
              onClick={mode === 'cooking' ? () => toggleCookingStep(i) : undefined}
            >
              {step}
            </li>
          ))}
        </ol>
      )}
      {mode === 'cooking' && (recipe.ingredients.length > 0 || recipe.steps.length > 0) && (
        <button
          data-testid="clear-cooking-btn"
          className="recipe-detail__clear-cooking"
          onClick={handleClearCooking}
        >
          Avmarkera allt
        </button>
      )}
    </div>
  );
}
