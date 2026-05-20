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
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');

  useEffect(() => {
    axios
      .get<ShoppingListFull>(`${API_URL}/shopping-lists/${id}`, { withCredentials: true })
      .then((r) => setList(r.data))
      .catch(() => setError('Kunde inte ladda inköpslistan.'));
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

  function renderItem(item: ShoppingListItem) {
    const cls = `shopping-list-detail__item${item.checked ? ' shopping-list-detail__item--checked' : ''}`;
    return (
      <label key={item.id} className={cls}>
        <input
          type="checkbox"
          checked={item.checked}
          aria-label={item.ingredient.name}
          onChange={() => handleToggle(item)}
        />
        <span className="shopping-list-detail__name">{item.ingredient.name}</span>
      </label>
    );
  }

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemName.trim()) return;
    axios
      .post(
        `${API_URL}/shopping-lists/${id}/items`,
        { name: newItemName.trim(), quantity: parseFloat(newItemQuantity.replace(',', '.')) || 1, unit: newItemUnit },
        { withCredentials: true }
      )
      .then((r) => {
        setList((prev) =>
          prev ? { ...prev, items: [r.data, ...prev.items] } : prev
        );
        setNewItemName('');
        setNewItemQuantity('');
        setNewItemUnit('');
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
      <form className="shopping-list-detail__add-form" onSubmit={handleAddItem}>
        <input
          className="shopping-list-detail__add-name"
          data-testid="add-item-name"
          placeholder="Vara"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <input
          className="shopping-list-detail__add-quantity"
          data-testid="add-item-quantity"
          placeholder="Mängd"
          value={newItemQuantity}
          onChange={(e) => setNewItemQuantity(e.target.value)}
        />
        <input
          className="shopping-list-detail__add-unit"
          data-testid="add-item-unit"
          placeholder="Enhet"
          value={newItemUnit}
          onChange={(e) => setNewItemUnit(e.target.value)}
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
