import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

beforeEach(() => jest.resetAllMocks());

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

const emptyProgress = { checked_ingredients: [], checked_steps: [] };

function renderRecipeDetail(recipe: Recipe, lists: { id: number; name: string }[] = []) {
  mockedAxios.get
    .mockResolvedValueOnce({ data: recipe })
    .mockResolvedValueOnce({ data: lists })
    .mockResolvedValueOnce({ data: emptyProgress });
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

  it('visar en lägesknapp för att växla till tillagningsläge', async () => {
    renderRecipeDetail(baseRecipe);
    await screen.findByText('Pasta Carbonara');

    expect(screen.getByTestId('mode-toggle-cooking')).toBeInTheDocument();
  });

  it('visar skalade mängder när skalfaktor ändras', async () => {
    const ingredients = [{ name: 'pasta', quantity: 200, unit: 'g' }];
    renderRecipeDetail({ ...baseRecipe, ingredients });
    await screen.findByText('200 g pasta');

    fireEvent.click(screen.getByTestId('scale-btn-2'));

    expect(screen.getByText('400 g pasta')).toBeInTheDocument();
  });

  it('visar skalfaktor-knappar och skalade mängder i tillagningsläge', async () => {
    const ingredients = [{ name: 'pasta', quantity: 200, unit: 'g' }];
    renderRecipeDetail({ ...baseRecipe, ingredients });
    await screen.findByText('Pasta Carbonara');

    fireEvent.click(screen.getByTestId('scale-btn-2'));
    fireEvent.click(screen.getByTestId('mode-toggle-cooking'));

    expect(screen.getByTestId('scale-btn-2')).toBeInTheDocument();
    expect(screen.getByText('400 g pasta')).toBeInTheDocument();
  });

  it('visar skalfaktor-knappar i planeringsläge', async () => {
    renderRecipeDetail({ ...baseRecipe, ingredients: [{ name: 'pasta', quantity: 200, unit: 'g' }] });
    await screen.findByText('Pasta Carbonara');

    expect(screen.getByTestId('scale-btn-0.5')).toBeInTheDocument();
    expect(screen.getByTestId('scale-btn-1')).toBeInTheDocument();
    expect(screen.getByTestId('scale-btn-2')).toBeInTheDocument();
    expect(screen.getByTestId('scale-btn-3')).toBeInTheDocument();
    expect(screen.getByTestId('scale-btn-4')).toBeInTheDocument();
  });

  it('visar en listväljare i planeringsläge med hämtade listor', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { ...baseRecipe, ingredients: [{ name: 'pasta', quantity: 200, unit: 'g' }] } })
      .mockResolvedValueOnce({ data: [{ id: 1, name: 'ICA' }, { id: 2, name: 'Willys' }] })
      .mockResolvedValueOnce({ data: emptyProgress });

    renderComponent();

    expect(await screen.findByRole('option', { name: 'ICA' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Willys' })).toBeInTheDocument();
  });

  it('lägger till ingrediens i vald lista när den klickas i planeringsläge', async () => {
    const ingredients = [{ name: 'pasta', quantity: 200, unit: 'g' }];
    mockedAxios.post.mockResolvedValue({ data: { id: 10, quantity: 200, unit: 'g', ingredient: { id: 5, name: 'pasta' } } });
    renderRecipeDetail({ ...baseRecipe, servings: 4, ingredients }, [{ id: 3, name: 'ICA' }]);
    await screen.findByText('Pasta Carbonara');

    fireEvent.click(screen.getByTestId('ingredient-pasta'));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/shopping-lists/3/items'),
      expect.objectContaining({ name: 'pasta', quantity: 200, unit: 'g' }),
      expect.any(Object)
    );
  });

  it('markerar en ingrediens som tagen i tillagningsläge', async () => {
    const ingredients = [{ name: 'pasta', quantity: 200, unit: 'g' }];
    mockedAxios.put.mockResolvedValue({});
    renderRecipeDetail({ ...baseRecipe, ingredients });
    await screen.findByText('Pasta Carbonara');

    fireEvent.click(screen.getByTestId('mode-toggle-cooking'));
    fireEvent.click(screen.getByTestId('ingredient-pasta'));

    expect(screen.getByTestId('ingredient-pasta')).toHaveClass('recipe-detail__ingredient--checked');
  });

  it('markerar ett steg som utfört i tillagningsläge', async () => {
    mockedAxios.put.mockResolvedValue({});
    renderRecipeDetail({ ...baseRecipe, steps: ['Koka pastan.'] });
    await screen.findByText('Pasta Carbonara');

    fireEvent.click(screen.getByTestId('mode-toggle-cooking'));
    fireEvent.click(screen.getByTestId('step-0'));

    expect(screen.getByTestId('step-0')).toHaveClass('recipe-detail__step--checked');
  });

  it('avmarkerar allt vid klick på "Avmarkera allt"', async () => {
    const ingredients = [{ name: 'pasta', quantity: 200, unit: 'g' }];
    mockedAxios.put.mockResolvedValue({});
    mockedAxios.delete.mockResolvedValue({});
    renderRecipeDetail({ ...baseRecipe, ingredients, steps: ['Koka.'] });
    await screen.findByText('Pasta Carbonara');

    fireEvent.click(screen.getByTestId('mode-toggle-cooking'));
    fireEvent.click(screen.getByTestId('ingredient-pasta'));
    fireEvent.click(screen.getByTestId('step-0'));
    fireEvent.click(screen.getByTestId('clear-cooking-btn'));

    expect(screen.getByTestId('ingredient-pasta')).not.toHaveClass('recipe-detail__ingredient--checked');
    expect(screen.getByTestId('step-0')).not.toHaveClass('recipe-detail__step--checked');
  });

  it('laddar och visar sparad cooking progress vid montering', async () => {
    const ingredients = [{ name: 'pasta', quantity: 200, unit: 'g' }];
    mockedAxios.get
      .mockResolvedValueOnce({ data: { ...baseRecipe, ingredients, steps: ['Koka.'] } })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: { checked_ingredients: ['pasta'], checked_steps: [0] } });

    renderComponent();
    fireEvent.click(await screen.findByTestId('mode-toggle-cooking'));

    expect(await screen.findByTestId('ingredient-pasta')).toHaveClass('recipe-detail__ingredient--checked');
    expect(screen.getByTestId('step-0')).toHaveClass('recipe-detail__step--checked');
  });

  it('sparar cooking progress till backend när en ingrediens markeras', async () => {
    const ingredients = [{ name: 'pasta', quantity: 200, unit: 'g' }];
    mockedAxios.put.mockResolvedValue({});
    renderRecipeDetail({ ...baseRecipe, ingredients });
    await screen.findByText('Pasta Carbonara');

    fireEvent.click(screen.getByTestId('mode-toggle-cooking'));
    fireEvent.click(screen.getByTestId('ingredient-pasta'));

    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining('/recipes/1/cooking-progress'),
      expect.objectContaining({ checked_ingredients: ['pasta'] }),
      expect.any(Object)
    );
  });

  it('visar ett felmeddelande när tillägg till inköpslista misslyckas', async () => {
    const ingredients = [{ name: 'pasta', quantity: 200, unit: 'g' }];
    mockedAxios.post.mockRejectedValue({ response: { status: 500 } });
    renderRecipeDetail({ ...baseRecipe, ingredients }, [{ id: 3, name: 'ICA' }]);
    await screen.findByText('Pasta Carbonara');

    fireEvent.click(screen.getByTestId('ingredient-pasta'));

    expect(await screen.findByRole('status')).toBeInTheDocument();
  });

  it('visar ett felmeddelande när borttagning från inköpslista misslyckas', async () => {
    const ingredients = [{ name: 'pasta', quantity: 200, unit: 'g' }];
    mockedAxios.post.mockResolvedValue({ data: { id: 10, quantity: 200, unit: 'g', ingredient: { id: 5, name: 'pasta' } } });
    mockedAxios.delete.mockRejectedValue({ response: { status: 500 } });
    renderRecipeDetail({ ...baseRecipe, ingredients }, [{ id: 3, name: 'ICA' }]);
    await screen.findByText('Pasta Carbonara');

    fireEvent.click(screen.getByTestId('ingredient-pasta'));
    await waitFor(() => expect(screen.getByTestId('ingredient-pasta')).toHaveClass('recipe-detail__ingredient--added'));
    fireEvent.click(screen.getByTestId('ingredient-pasta'));

    expect(await screen.findByRole('status')).toBeInTheDocument();
  });

  it('visar en toast när fetch misslyckas', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));
    renderComponent();
    expect(await screen.findByRole('status')).toHaveTextContent('Kunde inte ladda receptet.');
  });
});
