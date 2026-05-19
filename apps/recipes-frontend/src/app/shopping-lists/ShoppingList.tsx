import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

export function ShoppingList({ id }: { id: number }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/shopping-lists/${id}`, { withCredentials: true })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Laddar inköpslista...</p>;

  return null;
}
