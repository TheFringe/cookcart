import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { AddToListPanel } from './AddToListPanel';
import type { Recipe } from './types';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

beforeEach(() => jest.clearAllMocks());

const recipe: Recipe = {
  id: 1,
  name: 'Pasta Carbonara',
  description: null,
  cook_time_minutes: 25,
  servings: 4,
  source_name: null,
  source_url: null,
  tags: [],
  steps: [],
  ingredients: [
    { name: 'pasta', quantity: 200, unit: 'g' },
    { name: 'ägg', quantity: 2, unit: 'st' },
  ],
};

function renderPanel(overrides?: Partial<Recipe>) {
  mockedAxios.get.mockResolvedValue({ data: [] });
  return render(<AddToListPanel recipe={{ ...recipe, ...overrides }} onClose={jest.fn()} />);
}

describe('AddToListPanel', () => {
  it('renderar ett portionsfält med receptets portioner som standardvärde', () => {
    renderPanel();

    expect(screen.getByTestId('input-panel-servings')).toHaveValue(4);
  });

  it('renderar en förkryssad kryssruta per ingrediens', () => {
    renderPanel();

    expect(screen.getByTestId('ingredient-check-pasta')).toBeChecked();
    expect(screen.getByTestId('ingredient-check-ägg')).toBeChecked();
  });

  it('visar en listväljare med hämtade inköpslistor', async () => {
    mockedAxios.get.mockResolvedValue({ data: [{ id: 1, name: 'ICA' }, { id: 2, name: 'Willys' }] });
    render(<AddToListPanel recipe={recipe} onClose={jest.fn()} />);

    expect(await screen.findByRole('option', { name: 'ICA' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Willys' })).toBeInTheDocument();
  });

  it('POSTar skalade mängder för markerade ingredienser vid submit', async () => {
    mockedAxios.get.mockResolvedValue({ data: [{ id: 3, name: 'ICA' }] });
    mockedAxios.post.mockResolvedValue({ data: {} });
    render(<AddToListPanel recipe={recipe} onClose={jest.fn()} />);
    await screen.findByRole('option', { name: 'ICA' });

    // Dubbla portioner (4 → 8): scale = 2
    const { fireEvent } = await import('@testing-library/react');
    fireEvent.change(screen.getByTestId('input-panel-servings'), { target: { value: '8' } });
    fireEvent.submit(screen.getByTestId('add-to-list-panel'));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/shopping-lists/3/items'),
      expect.objectContaining({ name: 'pasta', quantity: 400, unit: 'g' }),
      expect.any(Object)
    );
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/shopping-lists/3/items'),
      expect.objectContaining({ name: 'ägg', quantity: 4, unit: 'st' }),
      expect.any(Object)
    );
  });

  it('stänger panelen efter lyckat submit', async () => {
    const onClose = jest.fn();
    mockedAxios.get.mockResolvedValue({ data: [{ id: 3, name: 'ICA' }] });
    mockedAxios.post.mockResolvedValue({ data: {} });
    render(<AddToListPanel recipe={recipe} onClose={onClose} />);
    await screen.findByRole('option', { name: 'ICA' });

    const { fireEvent } = await import('@testing-library/react');
    fireEvent.submit(screen.getByTestId('add-to-list-panel'));

    await screen.findByTestId('add-to-list-panel');
    expect(onClose).toHaveBeenCalled();
  });
});
