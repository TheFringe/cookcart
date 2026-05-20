import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import type { Recipe } from './types';

export function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Recipe[]>(`${API_URL}/recipes`, { withCredentials: true })
      .then((r) => setRecipes(r.data))
      .finally(() => setLoading(false));
  }, []);

  const allTags = Array.from(new Set(recipes.flatMap((r) => r.tags ?? [])));
  const visible = activeTag ? recipes.filter((r) => r.tags?.includes(activeTag)) : recipes;

  return (
    <div data-testid="recipe-list" className="recipe-list">
      <Link to="/recipes/new" className="recipe-list__new-btn">+ Nytt recept</Link>
      {allTags.length > 0 && (
        <div className="recipe-list__tags">
          {allTags.map((tag) => (
            <button
              key={tag}
              data-testid={`tag-filter-${tag}`}
              className={`recipe-list__tag${activeTag === tag ? ' recipe-list__tag--active' : ''}`}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      {loading && <p className="recipe-loading">Laddar recept...</p>}
      {!loading && visible.length === 0 && <p className="recipe-empty">Inga recept hittades</p>}
      {visible.map((r) => (
        <article key={r.id} data-testid="recipe-item" className="recipe-card">
          <div className="recipe-card__body">
            <h2 className="recipe-card__name">
              <Link to={`/recipes/${r.id}`}>{r.name}</Link>
            </h2>
            {r.description && <p className="recipe-card__description">{r.description}</p>}
          </div>
          <div className="recipe-card__meta">
            {r.cook_time_minutes && <span>{r.cook_time_minutes} min</span>}
            {r.servings && <span>{r.servings} portioner</span>}
          </div>
        </article>
      ))}
    </div>
  );
}
