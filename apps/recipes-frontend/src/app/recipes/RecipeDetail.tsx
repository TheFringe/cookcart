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

  function handleDelete() {
    axios
      .delete(`${API_URL}/recipes/${id}`, { withCredentials: true })
      .then(() => navigate('/'));
  }

  useEffect(() => {
    axios
      .get<Recipe>(`${API_URL}/recipes/${id}`, { withCredentials: true })
      .then((r) => setRecipe(r.data))
      .catch(() => setError('Kunde inte ladda receptet.'));
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
      {recipe.ingredients.length > 0 && (
        <ul data-testid="ingredients-list" className="recipe-detail__ingredients">
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing.quantity} {ing.unit} {ing.name}</li>
          ))}
        </ul>
      )}
      {recipe.steps.length > 0 && (
        <ol className="recipe-detail__steps">
          {recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
