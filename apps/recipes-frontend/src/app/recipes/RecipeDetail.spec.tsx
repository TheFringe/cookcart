import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
import axios from 'axios';
import { RecipeDetail } from './RecipeDetail';
import type { Ingredient, Recipe } from './types';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

beforeEach(() => jest.clearAllMocks());

const baseRecipe: Recipe = {
  id: 1,
  name: 'Pasta Carbonara',
  description: null,
  cook_time_minutes: null,
  servings: null,
  source_name: null,
  source_url: null,
  tags: [],
  steps: [],
  ingredients: [],
};

function renderComponent() {
  render(
    <MemoryRouter initialEntries={['/recipes/1']}>
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

function renderRecipeDetail(recipe: Recipe) {
  mockedAxios.get.mockResolvedValue({ data: recipe });
  renderComponent();
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

  it('visar receptets ingredienser', async () => {
    const ingredients: Ingredient[] = [
      { name: 'pasta', quantity: 200, unit: 'g' },
      { name: 'ägg', quantity: 2, unit: 'st' },
    ];
    renderRecipeDetail({ ...baseRecipe, ingredients });

    await screen.findByText('Pasta Carbonara');

    expect(screen.getByTestId('ingredients-list')).toBeInTheDocument();
    expect(screen.getByText('200 g pasta')).toBeInTheDocument();
    expect(screen.getByText('2 st ägg')).toBeInTheDocument();
  });

  it('visar en länk tillbaka till receptlistan', async () => {
    renderRecipeDetail(baseRecipe);
    await screen.findByText('Pasta Carbonara');
    expect(screen.getByRole('link', { name: /tillbaka/i })).toHaveAttribute('href', '/');
  });

  it('visar en redigera-länk till redigeringssidan', async () => {
    renderRecipeDetail(baseRecipe);
    await screen.findByText('Pasta Carbonara');
    expect(screen.getByRole('link', { name: /redigera/i })).toHaveAttribute('href', '/recipes/1/edit');
  });

  it('visar en radera-knapp', async () => {
    renderRecipeDetail(baseRecipe);
    await screen.findByText('Pasta Carbonara');

    expect(screen.getByTestId('delete-btn')).toBeInTheDocument();
  });

  it('visar en bekräftelsedialog när radera-knappen klickas', async () => {
    renderRecipeDetail(baseRecipe);
    await screen.findByText('Pasta Carbonara');

    fireEvent.click(screen.getByTestId('delete-btn'));

    expect(screen.getByTestId('delete-confirm-dialog')).toBeInTheDocument();
  });

  it('stänger dialogen när avbryt klickas', async () => {
    renderRecipeDetail(baseRecipe);
    await screen.findByText('Pasta Carbonara');

    fireEvent.click(screen.getByTestId('delete-btn'));
    fireEvent.click(screen.getByTestId('delete-cancel-btn'));

    expect(screen.queryByTestId('delete-confirm-dialog')).not.toBeInTheDocument();
  });

  it('anropar DELETE och navigerar till startsidan när bekräftelse klickas', async () => {
    const mockNavigate = jest.fn();
    jest.mocked(useNavigate).mockReturnValue(mockNavigate);
    mockedAxios.delete.mockResolvedValue({});
    renderRecipeDetail(baseRecipe);
    await screen.findByText('Pasta Carbonara');

    fireEvent.click(screen.getByTestId('delete-btn'));
    fireEvent.click(screen.getByTestId('delete-confirm-btn'));

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/recipes/1'),
      expect.any(Object)
    );
    await screen.findByText('Pasta Carbonara');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('visar en toast när fetch misslyckas', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));
    renderComponent();
    expect(await screen.findByRole('status')).toHaveTextContent('Kunde inte ladda receptet.');
  });
});
