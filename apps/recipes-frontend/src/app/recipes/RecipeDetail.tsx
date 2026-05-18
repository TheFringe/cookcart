import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import type { Recipe } from './types';

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    axios
      .get<Recipe>(`${API_URL}/recipes/${id}`, { withCredentials: true })
      .then((r) => setRecipe(r.data));
  }, [id]);

  if (!recipe) return <p className="recipe-loading">Laddar recept...</p>;

  return (
    <div data-testid="recipe-detail" className="recipe-detail">
      <Link to="/" className="recipe-detail__back">← Tillbaka</Link>
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
    </div>
  );
}
