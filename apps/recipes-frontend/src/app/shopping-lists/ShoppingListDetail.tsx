import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { Toast } from '../shared/Toast';

interface ShoppingListItem {
  id: number;
  ingredient: { id: number; name: string };
  quantity: number;
  unit: string;
  checked: boolean;
}

interface ShoppingListFull {
  id: number;
  name: string;
  items: ShoppingListItem[];
}

export function ShoppingListDetail() {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<ShoppingListFull | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: '', quantity: '', unit: '' });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get<ShoppingListFull>(`${API_URL}/shopping-lists/${id}`, { withCredentials: true })
      .then((r) => setList(r.data))
      .catch(() => setError('Kunde inte ladda inköpslistan.'));
    axios
      .get<{ id: number; name: string }[]>(`${API_URL}/ingredients`, { withCredentials: true })
      .then((r) => setSuggestions(r.data.map((i) => i.name)))
      .catch(() => undefined);
  }, [id]);

  function patchChecked(itemId: number, checked: boolean) {
    setList((prev) =>
      prev
        ? { ...prev, items: prev.items.map((i) => (i.id === itemId ? { ...i, checked } : i)) }
        : prev
    );
  }

  function handleToggle(item: ShoppingListItem) {
    const next = !item.checked;
    patchChecked(item.id, next);
    axios
      .patch(`${API_URL}/shopping-lists/${id}/items/${item.id}`, { checked: next }, { withCredentials: true })
      .catch(() => {
        patchChecked(item.id, item.checked);
        setError('Kunde inte uppdatera varan.');
      });
  }

  function handleDelete(itemId: number) {
    setList((prev) =>
      prev ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) } : prev
    );
    axios
      .delete(`${API_URL}/shopping-lists/${id}/items/${itemId}`, { withCredentials: true })
      .catch(() => setError('Kunde inte ta bort varan.'));
  }

  function renderItem(item: ShoppingListItem) {
    const cls = `shopping-list-detail__item${item.checked ? ' shopping-list-detail__item--checked' : ''}`;
    return (
      <div key={item.id} className={cls}>
        <label className="shopping-list-detail__item-label">
          <input
            type="checkbox"
            checked={item.checked}
            aria-label={item.ingredient.name}
            onChange={() => handleToggle(item)}
          />
          <span className="shopping-list-detail__name">{item.ingredient.name}</span>
        </label>
        <button
          type="button"
          data-testid={`delete-item-${item.id}`}
          className="shopping-list-detail__delete-btn"
          aria-label={`Ta bort ${item.ingredient.name}`}
          onClick={() => handleDelete(item.id)}
        >×</button>
      </div>
    );
  }

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) return;
    axios
      .post(
        `${API_URL}/shopping-lists/${id}/items`,
        { name: draft.name.trim(), quantity: parseFloat(draft.quantity.replace(',', '.')) || 1, unit: draft.unit },
        { withCredentials: true }
      )
      .then((r) => {
        setList((prev) => prev ? { ...prev, items: [r.data, ...prev.items] } : prev);
        setDraft({ name: '', quantity: '', unit: '' });
      })
      .catch(() => setError('Kunde inte lägga till varan.'));
  }

  if (!list) {
    return error ? <Toast message={error} onDismiss={() => setError(null)} /> : <p>Laddar...</p>;
  }

  const active = list.items.filter((i) => !i.checked);
  const picked = list.items.filter((i) => i.checked);

  return (
    <div data-testid="shopping-list-detail" className="shopping-list-detail">
      {error && <Toast message={error} onDismiss={() => setError(null)} />}
      <div className="shopping-list-detail__nav">
        <Link to="/shopping-lists" className="shopping-list-detail__back">← Tillbaka</Link>
        <Link to={`/shopping-lists/${id}/edit`} className="shopping-list-detail__edit">Redigera</Link>
      </div>
      <h1 className="shopping-list-detail__title">{list.name}</h1>
      <datalist id="ingredients-suggestions">
        {suggestions.map((name) => <option key={name} value={name} />)}
      </datalist>
      <form className="shopping-list-detail__add-form" onSubmit={handleAddItem}>
        <input
          className="shopping-list-detail__add-name"
          data-testid="add-item-name"
          placeholder="Vara"
          list="ingredients-suggestions"
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
        />
        <input
          className="shopping-list-detail__add-quantity"
          data-testid="add-item-quantity"
          placeholder="Mängd"
          value={draft.quantity}
          onChange={(e) => setDraft((d) => ({ ...d, quantity: e.target.value }))}
        />
        <input
          className="shopping-list-detail__add-unit"
          data-testid="add-item-unit"
          placeholder="Enhet"
          value={draft.unit}
          onChange={(e) => setDraft((d) => ({ ...d, unit: e.target.value }))}
        />
        <button type="submit" data-testid="add-item-btn" className="shopping-list-detail__add-btn">+ Lägg till</button>
      </form>
      <div data-testid="active-items">{active.map(renderItem)}</div>
      {picked.length > 0 && (
        <div data-testid="picked-items">
          <p className="shopping-list-detail__section-heading">Plockade varor</p>
          {picked.map(renderItem)}
        </div>
      )}
    </div>
  );
}
