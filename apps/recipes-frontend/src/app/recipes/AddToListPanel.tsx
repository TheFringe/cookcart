import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import type { Recipe } from './types';

interface ShoppingListSummary {
  id: number;
  name: string;
}

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

export function AddToListPanel({ recipe, onClose }: Props) {
  const [servings, setServings] = useState(recipe.servings ?? 4);
  const [lists, setLists] = useState<ShoppingListSummary[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(recipe.ingredients.map((i) => [i.name, true]))
  );

  useEffect(() => {
    axios
      .get<ShoppingListSummary[]>(`${API_URL}/shopping-lists`, { withCredentials: true })
      .then((r) => {
        setLists(r.data);
        if (r.data.length > 0) setSelectedListId(r.data[0].id);
      });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedListId) return;
    const baseServings = recipe.servings ?? servings;
    const scale = servings / baseServings;
    const selected = recipe.ingredients.filter((i) => checked[i.name]);
    Promise.all(
      selected.map((ing) =>
        axios.post(
          `${API_URL}/shopping-lists/${selectedListId}/items`,
          { name: ing.name, quantity: ing.quantity * scale, unit: ing.unit },
          { withCredentials: true }
        )
      )
    ).then(() => onClose());
  }

  return (
    <form data-testid="add-to-list-panel" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="panel-servings">Portioner</label>
        <input
          id="panel-servings"
          data-testid="input-panel-servings"
          type="number"
          min="1"
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
        />
      </div>
      {recipe.ingredients.map((ing) => (
        <label key={ing.name}>
          <input
            type="checkbox"
            data-testid={`ingredient-check-${ing.name}`}
            checked={checked[ing.name]}
            onChange={(e) => setChecked((prev) => ({ ...prev, [ing.name]: e.target.checked }))}
          />
          {ing.name}
        </label>
      ))}
      <select
        data-testid="list-select"
        value={selectedListId ?? ''}
        onChange={(e) => setSelectedListId(Number(e.target.value))}
      >
        {lists.map((l) => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
      <button type="submit" data-testid="add-to-list-submit">Lägg till</button>
      <button type="button" data-testid="add-to-list-cancel" onClick={onClose}>Avbryt</button>
    </form>
  );
}
