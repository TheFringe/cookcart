import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div data-testid="recipe-form">
      <form onSubmit={handleSubmit}>
        <input data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea data-testid="input-steps" value={stepsText} onChange={(e) => setStepsText(e.target.value)} />
        <button data-testid="submit-btn" type="submit">Spara</button>
      </form>
    </div>
  );
}
