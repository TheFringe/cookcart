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

describe('RecipeForm — redigera', () => {
  it('förifylls med receptets namn och steg när recipeId skickas in', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { id: 1, name: 'Pasta', steps: ['Koka vatten', 'Koka pasta'], ingredients: [] },
    });

    renderForm('1');

    expect(await screen.findByDisplayValue('Pasta')).toBeInTheDocument();
    expect(screen.getByTestId('input-steps')).toHaveValue('Koka vatten\nKoka pasta');
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

describe('RecipeForm — skapa', () => {
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
