import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import type { Recipe } from './types';

export function RecipeForm({ recipeId }: { recipeId?: string }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [stepsText, setStepsText] = useState('');

  useEffect(() => {
    if (!recipeId) return;
    axios
      .get<Recipe>(`${API_URL}/recipes/${recipeId}`, { withCredentials: true })
      .then((r) => {
        setName(r.data.name);
        setStepsText(r.data.steps.join('\n'));
      });
  }, [recipeId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = { name, steps: stepsText.split('\n').filter((s) => s.trim()) };
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
        <div className="recipe-form__actions">
          <button className="recipe-form__submit" data-testid="submit-btn" type="submit">Spara</button>
          {recipeId && <Link to={`/recipes/${recipeId}`} className="recipe-form__cancel">Avbryt</Link>}
        </div>
      </form>
    </div>
  );
}
