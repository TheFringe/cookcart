import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import type { Recipe } from './types';

export function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Recipe[]>(`${API_URL}/recipes`, { withCredentials: true })
      .then((r) => setRecipes(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Laddar recept...</p>;

  return (
    <div data-testid="recipe-list">
      {recipes.length === 0 && <p>Inga recept hittades</p>}
      {recipes.map((r) => (
        <article key={r.id} data-testid="recipe-item">
          <h2><Link to={`/recipes/${r.id}`}>{r.name}</Link></h2>
          {r.description && <p>{r.description}</p>}
          {r.cook_time_minutes && <span>{r.cook_time_minutes} min</span>}
          {r.servings && <span>{r.servings} portioner</span>}
        </article>
      ))}
    </div>
  );
}
