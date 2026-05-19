import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { RecipeDetail } from './RecipeDetail';
import type { Recipe } from './types';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

beforeEach(() => jest.clearAllMocks());

const baseRecipe: Recipe = {
  id: 1,
  name: 'Pasta Carbonara',
  description: null,
  cook_time_minutes: null,
  servings: null,
  steps: [],
};

function renderRecipeDetail(recipe: Recipe) {
  mockedAxios.get.mockResolvedValue({ data: recipe });
  render(
    <MemoryRouter initialEntries={['/recipes/1']}>
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('RecipeDetail', () => {
  it('visar receptets namn när det laddats', async () => {
    renderRecipeDetail(baseRecipe);
    expect(await screen.findByText('Pasta Carbonara')).toBeInTheDocument();
  });

  it('visar receptets steg i ordning', async () => {
    renderRecipeDetail({ ...baseRecipe, steps: ['Koka pastan.', 'Stek bacon.', 'Blanda ägg och ost.'] });

    await screen.findByText('Pasta Carbonara');

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Koka pastan.');
    expect(items[1]).toHaveTextContent('Stek bacon.');
    expect(items[2]).toHaveTextContent('Blanda ägg och ost.');
  });

  it('visar en länk tillbaka till receptlistan', async () => {
    renderRecipeDetail(baseRecipe);
    await screen.findByText('Pasta Carbonara');
    expect(screen.getByRole('link', { name: /tillbaka/i })).toHaveAttribute('href', '/');
  });
});
