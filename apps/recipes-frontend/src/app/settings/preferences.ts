export const PREF_LIST_KEY = 'recipes-preferred-list-id';

export function getPreferredListId(): number | null {
  const stored = localStorage.getItem(PREF_LIST_KEY);
  return stored ? Number(stored) : null;
}

export function setPreferredListId(id: number): void {
  localStorage.setItem(PREF_LIST_KEY, String(id));
}
