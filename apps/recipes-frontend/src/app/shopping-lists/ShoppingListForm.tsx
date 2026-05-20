import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';

export function ShoppingListForm({ listId }: { listId?: string }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    if (!listId) return;
    axios
      .get<{ id: number; name: string }>(`${API_URL}/shopping-lists/${listId}`, { withCredentials: true })
      .then((r) => setName(r.data.name));
  }, [listId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = { name };
    const req = listId
      ? axios.put(`${API_URL}/shopping-lists/${listId}`, body, { withCredentials: true })
      : axios.post(`${API_URL}/shopping-lists`, body, { withCredentials: true });
    req.then((r) => navigate(`/shopping-lists/${r.data.id}`));
  }

  return (
    <div data-testid="shopping-list-form" className="shopping-list-form">
      <h1 className="shopping-list-form__title">{listId ? 'Redigera lista' : 'Ny inköpslista'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="shopping-list-form__field">
          <label className="shopping-list-form__label" htmlFor="list-name">Namn</label>
          <input
            id="list-name"
            className="shopping-list-form__input"
            data-testid="input-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="shopping-list-form__actions">
          <button className="shopping-list-form__submit" data-testid="submit-btn" type="submit">Spara</button>
          {listId && <Link to={`/shopping-lists/${listId}`} className="shopping-list-form__cancel">Avbryt</Link>}
        </div>
      </form>
    </div>
  );
}
