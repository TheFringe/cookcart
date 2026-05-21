import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import type { Recipe } from './types';

type IngredientDraft = { quantity: string; unit: string; name: string };

const EMPTY_INGREDIENT: IngredientDraft = { quantity: '', unit: '', name: '' };

export function RecipeForm({ recipeId }: { recipeId?: string }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [ingredients, setIngredients] = useState<IngredientDraft[]>([]);
  const lastNameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    lastNameInputRef.current?.focus();
  }, [ingredients.length]);

  useEffect(() => {
    if (!recipeId) return;
    axios
      .get<Recipe>(`${API_URL}/recipes/${recipeId}`, { withCredentials: true })
      .then((r) => {
        setName(r.data.name);
        setDescription(r.data.description ?? '');
        setStepsText(r.data.steps.join('\n'));
        setCookTime(r.data.cook_time_minutes != null ? String(r.data.cook_time_minutes) : '');
        setServings(r.data.servings != null ? String(r.data.servings) : '');
        setTagsText((r.data.tags ?? []).join(', '));
        setSourceName(r.data.source_name ?? '');
        setSourceUrl(r.data.source_url ?? '');
        setIngredients(
          r.data.ingredients.map((ing) => ({
            quantity: String(ing.quantity ?? ''),
            unit: ing.unit ?? '',
            name: ing.name,
          }))
        );
      });
  }, [recipeId]);

  function addIngredient() {
    setIngredients((prev) => [...prev, EMPTY_INGREDIENT]);
  }

  function updateIngredient(i: number, field: keyof IngredientDraft, value: string) {
    setIngredients((prev) => prev.map((x, j) => (j === i ? { ...x, [field]: value } : x)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalizedIngredients = ingredients.map((ing) => ({
      ...ing,
      quantity: ing.quantity.replace(',', '.'),
    }));
    const tags = tagsText.split(',').map((t) => t.trim()).filter(Boolean);
    const body = { name, description, steps: stepsText.split('\n').filter((s) => s.trim()), cook_time_minutes: cookTime ? Number(cookTime) : null, servings: servings ? Number(servings) : null, tags, source_name: sourceName || null, source_url: sourceUrl || null, ingredients: normalizedIngredients };
    const req = recipeId
      ? axios.put(`${API_URL}/recipes/${recipeId}`, body, { withCredentials: true })
      : axios.post(`${API_URL}/recipes`, body, { withCredentials: true });
    req.then((r) => navigate(`/recipes/${r.data.id}`));
  }

  return (
    <div data-testid="recipe-form" className="recipe-form">
      <h1 className="recipe-form__title">{recipeId ? 'Redigera recept' : 'Nytt recept'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="recipe-form__field">
          <label className="recipe-form__label" htmlFor="recipe-name">Namn</label>
          <input
            id="recipe-name"
            className="recipe-form__input"
            data-testid="input-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="recipe-form__field">
          <label className="recipe-form__label" htmlFor="recipe-description">Beskrivning</label>
          <textarea
            id="recipe-description"
            className="recipe-form__textarea"
            data-testid="input-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div className="recipe-form__field">
          <label className="recipe-form__label" htmlFor="recipe-tags">Kategorier</label>
          <input
            id="recipe-tags"
            className="recipe-form__input"
            data-testid="input-tags"
            placeholder="t.ex. vegetariskt, pasta"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />
        </div>
        <div className="recipe-form__field">
          <label className="recipe-form__label" htmlFor="recipe-servings">Portioner</label>
          <input
            id="recipe-servings"
            className="recipe-form__input"
            data-testid="input-servings"
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
        </div>
        <div className="recipe-form__field">
          <label className="recipe-form__label" htmlFor="recipe-cook-time">Tillagningstid (min)</label>
          <input
            id="recipe-cook-time"
            className="recipe-form__input"
            data-testid="input-cook-time"
            type="number"
            min="0"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
          />
        </div>
        <div className="recipe-form__field">
          <label className="recipe-form__label" htmlFor="recipe-steps">Steg</label>
          <textarea
            id="recipe-steps"
            className="recipe-form__textarea"
            data-testid="input-steps"
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            rows={10}
          />
        </div>
        <div className="recipe-form__field">
          <label className="recipe-form__label" htmlFor="recipe-source-name">Källa</label>
          <input
            id="recipe-source-name"
            className="recipe-form__input"
            data-testid="input-source-name"
            placeholder="t.ex. Koket"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
          />
        </div>
        <div className="recipe-form__field">
          <label className="recipe-form__label" htmlFor="recipe-source-url">Käll-URL</label>
          <input
            id="recipe-source-url"
            className="recipe-form__input"
            data-testid="input-source-url"
            type="url"
            placeholder="https://..."
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
          />
        </div>
        {ingredients.length > 0 && (
          <div className="recipe-form__ingredient-header">
            <span>Namn</span>
            <span>Mängd</span>
            <span>Enhet</span>
          </div>
        )}
        {ingredients.map((ing, i) => (
          <div key={i} className="recipe-form__ingredient-row">
            <input className="recipe-form__input" data-testid={`ingredient-name-${i}`} aria-label="Namn" ref={i === ingredients.length - 1 ? lastNameInputRef : null} value={ing.name} onChange={(e) => updateIngredient(i, 'name', e.target.value)} />
            <input className="recipe-form__input" data-testid={`ingredient-quantity-${i}`} aria-label="Mängd" value={ing.quantity} onChange={(e) => updateIngredient(i, 'quantity', e.target.value)} />
            <input className="recipe-form__input" data-testid={`ingredient-unit-${i}`} aria-label="Enhet" value={ing.unit} onChange={(e) => updateIngredient(i, 'unit', e.target.value)} />
          </div>
        ))}
        <button className="recipe-form__add-ingredient" data-testid="add-ingredient-btn" type="button" onClick={addIngredient}>+ Lägg till ingrediens</button>
        <div className="recipe-form__actions">
          <button className="recipe-form__submit" data-testid="submit-btn" type="submit">Spara</button>
          <Link to={recipeId ? `/recipes/${recipeId}` : '/'} className="recipe-form__cancel">Avbryt</Link>
        </div>
      </form>
    </div>
  );
}
