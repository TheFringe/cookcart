import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { RecipeForm } from './RecipeForm';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

function renderForm(recipeId?: string) {
  return render(
    <MemoryRouter>
      <RecipeForm recipeId={recipeId} />
    </MemoryRouter>
  );
}

describe('RecipeForm — tillagningstid', () => {
  it('renderar ett fält för tillagningstid', () => {
    renderForm();

    expect(screen.getByTestId('input-cook-time')).toBeInTheDocument();
  });
});

describe('RecipeForm — portioner', () => {
  it('renderar ett fält för portioner', () => {
    renderForm();

    expect(screen.getByTestId('input-servings')).toBeInTheDocument();
  });
});

describe('RecipeForm — skapa (beskrivning)', () => {
  it('renderar ett fält för beskrivning', () => {
    renderForm();

    expect(screen.getByTestId('input-description')).toBeInTheDocument();
  });

  it('skickar med beskrivningen i POST-bodyn vid submit', () => {
    mockedAxios.post.mockResolvedValue({ data: { id: 1 } });

    renderForm();
    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'Pasta' } });
    fireEvent.change(screen.getByTestId('input-description'), { target: { value: 'En klassiker' } });
    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/recipes'),
      expect.objectContaining({ description: 'En klassiker' }),
      expect.any(Object)
    );
  });
});

describe('RecipeForm — redigera', () => {
  it('förifylls med receptets namn och steg när recipeId skickas in', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { id: 1, name: 'Pasta', steps: ['Koka vatten', 'Koka pasta'], ingredients: [] },
    });

    renderForm('1');

    expect(await screen.findByDisplayValue('Pasta')).toBeInTheDocument();
    expect(screen.getByTestId('input-steps')).toHaveValue('Koka vatten\nKoka pasta');
  });

  it('förifylls med receptets beskrivning när recipeId skickas in', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { id: 1, name: 'Pasta', description: 'En god pastarätt', steps: [], ingredients: [] },
    });

    renderForm('1');
    await screen.findByDisplayValue('Pasta');

    expect(screen.getByTestId('input-description')).toHaveValue('En god pastarätt');
  });

  it('förifylls med receptets ingredienser när recipeId skickas in', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        id: 1,
        name: 'Pasta',
        steps: [],
        ingredients: [{ quantity: 2, unit: 'dl', name: 'mjöl' }],
      },
    });

    renderForm('1');
    await screen.findByDisplayValue('Pasta');

    expect(screen.getByTestId('ingredient-quantity-0')).toHaveValue('2');
    expect(screen.getByTestId('ingredient-unit-0')).toHaveValue('dl');
    expect(screen.getByTestId('ingredient-name-0')).toHaveValue('mjöl');
  });

  it('visar en avbryt-länk som leder tillbaka till receptsidan', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { id: 1, name: 'Pasta', steps: [], ingredients: [] },
    });

    renderForm('1');
    await screen.findByDisplayValue('Pasta');

    expect(screen.getByRole('link', { name: /avbryt/i })).toHaveAttribute('href', '/recipes/1');
  });

  it('anropar PUT när formuläret skickas i redigera-läge', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { id: 1, name: 'Pasta', steps: ['Koka vatten'], ingredients: [] },
    });
    mockedAxios.put.mockResolvedValue({ data: { id: 1 } });

    renderForm('1');
    await screen.findByDisplayValue('Pasta');

    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining('/recipes/1'),
      expect.objectContaining({ name: 'Pasta' }),
      expect.any(Object)
    );
  });
});

describe('RecipeForm — ingredienser', () => {
  it('normaliserar komma till punkt i mängd vid submit', () => {
    mockedAxios.post.mockResolvedValue({ data: { id: 1 } });

    renderForm();
    fireEvent.click(screen.getByTestId('add-ingredient-btn'));
    fireEvent.change(screen.getByTestId('ingredient-quantity-0'), { target: { value: '1,5' } });
    fireEvent.change(screen.getByTestId('ingredient-name-0'), { target: { value: 'grädde' } });
    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/recipes'),
      expect.objectContaining({
        ingredients: [expect.objectContaining({ quantity: '1.5' })],
      }),
      expect.any(Object)
    );
  });

  it('visar labels kopplade till ingrediensfälten', () => {
    renderForm();
    fireEvent.click(screen.getByTestId('add-ingredient-btn'));

    expect(screen.getByLabelText(/mängd/i)).toHaveAttribute('data-testid', 'ingredient-quantity-0');
    expect(screen.getByLabelText(/enhet/i)).toHaveAttribute('data-testid', 'ingredient-unit-0');
  });

  it('sätter fokus på namnfältet när en ingrediensrad läggs till', () => {
    renderForm();

    fireEvent.click(screen.getByTestId('add-ingredient-btn'));

    expect(screen.getByTestId('ingredient-name-0')).toHaveFocus();
  });

  it('visar en knapp för att lägga till ingrediens', () => {
    renderForm();

    expect(screen.getByTestId('add-ingredient-btn')).toBeInTheDocument();
  });

  it('visar ingrediensfälten i ordningen namn, mängd, enhet', () => {
    renderForm();
    fireEvent.click(screen.getByTestId('add-ingredient-btn'));

    const row = screen.getByTestId('ingredient-name-0').closest('div')!;
    const inputs = Array.from(row.querySelectorAll('input'));
    expect(inputs[0]).toHaveAttribute('data-testid', 'ingredient-name-0');
    expect(inputs[1]).toHaveAttribute('data-testid', 'ingredient-quantity-0');
    expect(inputs[2]).toHaveAttribute('data-testid', 'ingredient-unit-0');
  });

  it('lägger till en ingrediensrad med fält för mängd, enhet och namn när knappen klickas', () => {
    renderForm();

    fireEvent.click(screen.getByTestId('add-ingredient-btn'));

    expect(screen.getByTestId('ingredient-quantity-0')).toBeInTheDocument();
    expect(screen.getByTestId('ingredient-unit-0')).toBeInTheDocument();
    expect(screen.getByTestId('ingredient-name-0')).toBeInTheDocument();
  });
});

describe('RecipeForm — skapa', () => {
  it('skickar med ingredienser i POST-bodyn vid submit', () => {
    mockedAxios.post.mockResolvedValue({ data: { id: 1 } });

    renderForm();

    fireEvent.click(screen.getByTestId('add-ingredient-btn'));
    fireEvent.change(screen.getByTestId('ingredient-quantity-0'), { target: { value: '2' } });
    fireEvent.change(screen.getByTestId('ingredient-unit-0'), { target: { value: 'dl' } });
    fireEvent.change(screen.getByTestId('ingredient-name-0'), { target: { value: 'mjöl' } });
    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/recipes'),
      expect.objectContaining({
        ingredients: [{ quantity: '2', unit: 'dl', name: 'mjöl' }],
      }),
      expect.any(Object)
    );
  });

  it('anropar POST med namn och steg splittade per radbrytning', async () => {
    mockedAxios.post.mockResolvedValue({ data: { id: 42 } });

    renderForm();

    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'Pasta' } });
    fireEvent.change(screen.getByTestId('input-steps'), { target: { value: 'Koka vatten\nKoka pasta' } });
    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/recipes'),
      expect.objectContaining({
        name: 'Pasta',
        steps: ['Koka vatten', 'Koka pasta'],
      }),
      expect.any(Object)
    );
  });
});
