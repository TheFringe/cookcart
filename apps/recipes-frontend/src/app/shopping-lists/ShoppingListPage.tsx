import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { Toast } from '../shared/Toast';

interface ShoppingListSummary {
  id: number;
  name: string;
}

export function ShoppingListPage() {
  const [lists, setLists] = useState<ShoppingListSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<ShoppingListSummary[]>(`${API_URL}/shopping-lists`, { withCredentials: true })
      .then((r) => setLists(r.data))
      .catch(() => setError('Kunde inte ladda inköpslistorna.'));
  }, []);

  return (
    <div data-testid="shopping-list-page" className="shopping-list">
      {error && <Toast message={error} onDismiss={() => setError(null)} />}
      <div className="shopping-list__header">
        <h1 className="shopping-list__title">Inköpslistor</h1>
        <button className="shopping-list__new-btn" type="button">+ Ny lista</button>
      </div>
      <div className="shopping-list__rows">
        {lists.map((list) => (
          <div key={list.id} className="shopping-list__row">
            <span className="shopping-list__name">{list.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
