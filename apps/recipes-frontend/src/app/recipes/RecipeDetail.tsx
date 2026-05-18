import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

  if (!recipe) return <p>Laddar recept...</p>;

  return (
    <div data-testid="recipe-detail">
      <h1>{recipe.name}</h1>
      {recipe.description && <p>{recipe.description}</p>}
      {recipe.cook_time_minutes && <span>{recipe.cook_time_minutes} min</span>}
      {recipe.servings && <span>{recipe.servings} portioner</span>}
    </div>
  );
}
