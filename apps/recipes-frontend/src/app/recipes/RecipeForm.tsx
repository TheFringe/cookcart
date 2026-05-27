import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { Toast } from '../shared/Toast';
import type { Recipe } from './types';
import { parseTextRecipe } from './parseTextRecipe';

type IngredientDraft = { quantity: string; unit: string; name: string; isSection: boolean };

const EMPTY_INGREDIENT: IngredientDraft = { quantity: '', unit: '', name: '', isSection: false };

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
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

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
        const drafts: IngredientDraft[] = [];
        let lastSection: string | null | undefined = undefined;
        for (const ing of r.data.ingredients) {
          const section = ing.section ?? null;
          if (section !== lastSection) {
            if (section) drafts.push({ isSection: true, name: section, quantity: '', unit: '' });
            lastSection = section;
          }
          drafts.push({ isSection: false, name: ing.name, quantity: String(ing.quantity ?? ''), unit: ing.unit ?? '' });
        }
        setIngredients(drafts);
      });
  }, [recipeId]);

  function addIngredient() {
    setIngredients((prev) => [...prev, EMPTY_INGREDIENT]);
  }

  function updateIngredient(i: number, field: keyof IngredientDraft, value: string) {
    setIngredients((prev) => prev.map((x, j) => (j === i ? { ...x, [field]: value } : x)));
  }

  function toggleSection(i: number) {
    setIngredients((prev) => prev.map((x, j) => (j === i ? { ...x, isSection: !x.isSection } : x)));
  }

  function removeIngredient(i: number) {
    setIngredients((prev) => prev.filter((_, j) => j !== i));
  }

  function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const d = parseTextRecipe(text);
      if (d.name) setName(d.name);
      if (d.steps?.length) setStepsText(d.steps.join('\n'));
      if (d.servings) setServings(String(d.servings));
      if (d.source_name) setSourceName(d.source_name);
      if (d.source_url) setSourceUrl(d.source_url);
      if (d.ingredients?.length) {
        setIngredients(d.ingredients.map((ing) => ({
          quantity: ing.quantity,
          unit: ing.unit,
          name: ing.name,
          isSection: false,
        })));
      }
      setImportError(null);
    };
    reader.onerror = () => setImportError('Kunde inte läsa filen.');
    reader.readAsText(file);
  }

  async function handleImport() {
    setImporting(true);
    setImportError(null);
    try {
      const r = await axios.post(`${API_URL}/recipes/import`, { url: importUrl }, { withCredentials: true });
      const d = r.data;
      if (d.name) setName(d.name);
      if (d.description) setDescription(d.description);
      if (d.steps?.length) setStepsText(d.steps.join('\n'));
      if (d.cook_time_minutes) setCookTime(String(d.cook_time_minutes));
      if (d.servings) setServings(String(d.servings));
      if (d.tags?.length) setTagsText(d.tags.join(', '));
      if (d.source_name) setSourceName(d.source_name);
      if (d.source_url) setSourceUrl(d.source_url);
      if (d.ingredients?.length) {
        setIngredients(d.ingredients.map((ing: IngredientDraft) => ({
          quantity: String(ing.quantity ?? ''),
          unit: ing.unit ?? '',
          name: ing.name,
          isSection: false,
        })));
      }
    } catch {
      setImportError('Kunde inte importera receptet.');
    } finally {
      setImporting(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let currentSection: string | null = null;
    const normalizedIngredients: { name: string; quantity: string; unit: string; section: string | null }[] = [];
    for (const ing of ingredients) {
      if (ing.isSection) {
        currentSection = ing.name || null;
      } else {
        normalizedIngredients.push({
          name: ing.name,
          quantity: ing.quantity.replace(',', '.'),
          unit: ing.unit,
          section: currentSection,
        });
      }
    }
    const tags = tagsText.split(',').map((t) => t.trim()).filter(Boolean);
    const body = { name, description, steps: stepsText.split('\n').filter((s) => s.trim()), cook_time_minutes: cookTime ? Number(cookTime) : null, servings: servings ? Number(servings) : null, tags, source_name: sourceName || null, source_url: sourceUrl || null, ingredients: normalizedIngredients };
    const req = recipeId
      ? axios.put(`${API_URL}/recipes/${recipeId}`, body, { withCredentials: true })
      : axios.post(`${API_URL}/recipes`, body, { withCredentials: true });
    req
      .then((r) => navigate(`/recipes/${r.data.id}`))
      .catch(() => setSaveError('Kunde inte spara receptet.'));
  }

  return (
    <>
    {saveError && <Toast message={saveError} onDismiss={() => setSaveError(null)} />}
    <div data-testid="recipe-form" className="recipe-form">
      <h1 className="recipe-form__title">{recipeId ? 'Redigera recept' : 'Nytt recept'}</h1>
      <form onSubmit={handleSubmit}>
        {!recipeId && (
          <div className="recipe-form__import" data-testid="import-section">
            <h2 className="recipe-form__import-title">Importera recept</h2>
            <div data-testid="import-row" className="recipe-form__import-row">
              <input
                data-testid="import-url-input"
                className="recipe-form__input"
                type="url"
                placeholder="https://koket.se/..."
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
              />
              <button
                data-testid="import-btn"
                type="button"
                className="recipe-form__import-btn"
                onClick={handleImport}
                disabled={!importUrl || importing}
              >
                {importing ? 'Hämtar...' : 'Hämta'}
              </button>
            </div>
            <div className="recipe-form__import-row">
              <input
                data-testid="import-file-input"
                type="file"
                accept=".txt,.md"
                className="recipe-form__input"
                onChange={handleFileImport}
              />
            </div>
            {importError && <p data-testid="import-error" className="recipe-form__import-error">{importError}</p>}
          </div>
        )}
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
          <div key={i} className={`recipe-form__ingredient-row${ing.isSection ? ' recipe-form__ingredient-row--section' : ''}`}>
            <input className={`recipe-form__input${ing.isSection ? ' recipe-form__ingredient-section-name' : ''}`} data-testid={`ingredient-name-${i}`} aria-label="Namn" ref={i === ingredients.length - 1 ? lastNameInputRef : null} value={ing.name} onChange={(e) => updateIngredient(i, 'name', e.target.value)} />
            {!ing.isSection && <input className="recipe-form__input" data-testid={`ingredient-quantity-${i}`} aria-label="Mängd" value={ing.quantity} onChange={(e) => updateIngredient(i, 'quantity', e.target.value)} />}
            {!ing.isSection && <input className="recipe-form__input" data-testid={`ingredient-unit-${i}`} aria-label="Enhet" value={ing.unit} onChange={(e) => updateIngredient(i, 'unit', e.target.value)} />}
            <button type="button" data-testid={`toggle-section-${i}`} className={`recipe-form__toggle-section${ing.isSection ? ' recipe-form__toggle-section--active' : ''}`} onClick={() => toggleSection(i)}>§</button>
            <button type="button" data-testid={`remove-ingredient-${i}`} className="recipe-form__remove-ingredient" onClick={() => removeIngredient(i)}>×</button>
          </div>
        ))}
        <button className="recipe-form__add-ingredient" data-testid="add-ingredient-btn" type="button" onClick={addIngredient}>+ Lägg till ingrediens</button>
        <div className="recipe-form__actions">
          <button className="recipe-form__submit" data-testid="submit-btn" type="submit">Spara</button>
          <Link to={recipeId ? `/recipes/${recipeId}` : '/'} className="recipe-form__cancel">Avbryt</Link>
        </div>
      </form>
    </div>
    </>
  );
}
