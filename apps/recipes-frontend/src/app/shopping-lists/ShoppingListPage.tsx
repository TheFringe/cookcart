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
    <div data-testid="shopping-list-page">
      {error && <Toast message={error} onDismiss={() => setError(null)} />}
      {lists.map((list) => (
        <div key={list.id}>{list.name}</div>
      ))}
    </div>
  );
}
