import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { PREF_LIST_KEY, getPreferredListId } from './preferences';

interface ShoppingListSummary {
  id: number;
  name: string;
}

export { getPreferredListId };

export function SettingsPage() {
  const [lists, setLists] = useState<ShoppingListSummary[]>([]);
  const [preferredListId, setPreferredListId] = useState<string>(
    () => localStorage.getItem(PREF_LIST_KEY) ?? ''
  );

  useEffect(() => {
    axios
      .get<ShoppingListSummary[]>(`${API_URL}/shopping-lists`, { withCredentials: true })
      .then((r) => { if (Array.isArray(r.data)) setLists(r.data); })
      .catch(() => {});
  }, []);

  function handleListChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setPreferredListId(val);
    if (val) {
      localStorage.setItem(PREF_LIST_KEY, val);
    } else {
      localStorage.removeItem(PREF_LIST_KEY);
    }
  }

  return (
    <div data-testid="settings-page" className="settings-page">
      <div className="settings-page__field">
        <label className="settings-page__label" htmlFor="preferred-list">Föredragen inköpslista</label>
        <select
          id="preferred-list"
          data-testid="preferred-list-select"
          className="settings-page__select"
          value={preferredListId}
          onChange={handleListChange}
        >
          <option value="">Första listan</option>
          {lists.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
