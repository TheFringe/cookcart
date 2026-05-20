import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { RecipeList } from './RecipeList';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

beforeEach(() => jest.clearAllMocks());

describe('RecipeList', () => {
  it('visar laddningsindikator medan recept hämtas', () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {}));

    render(<MemoryRouter><RecipeList /></MemoryRouter>);

    expect(screen.getByText('Laddar recept...')).toBeInTheDocument();
  });

  it('visar receptlistan när data returneras', async () => {
    const recipes = [
      { id: 1, name: 'Pasta Carbonara', description: 'Klassisk pasta', cook_time_minutes: 25, servings: 4 },
      { id: 2, name: 'Köttbullar', description: null, cook_time_minutes: null, servings: 2 },
    ];
    mockedAxios.get.mockResolvedValue({ data: recipes });

    render(<MemoryRouter><RecipeList /></MemoryRouter>);

    expect(await screen.findAllByTestId('recipe-item')).toHaveLength(2);
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
    expect(screen.getByText('Klassisk pasta')).toBeInTheDocument();
    expect(screen.getByText('25 min')).toBeInTheDocument();
    expect(screen.getByText('4 portioner')).toBeInTheDocument();
    expect(screen.getByText('Köttbullar')).toBeInTheDocument();
  });

  it('visar meddelande när inga recept finns', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    render(<MemoryRouter><RecipeList /></MemoryRouter>);

    expect(await screen.findByText('Inga recept hittades')).toBeInTheDocument();
  });

  it('visar en länk till att skapa nytt recept', () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {}));

    render(<MemoryRouter><RecipeList /></MemoryRouter>);

    expect(screen.getByRole('link', { name: /nytt recept/i })).toHaveAttribute('href', '/recipes/new');
  });

  it('filtrerar recepten när en tagg väljs', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        { id: 1, name: 'Pasta', description: null, cook_time_minutes: null, servings: null, tags: ['vegetariskt'] },
        { id: 2, name: 'Köttbullar', description: null, cook_time_minutes: null, servings: null, tags: ['kött'] },
      ],
    });

    render(<MemoryRouter><RecipeList /></MemoryRouter>);
    await screen.findAllByTestId('recipe-item');

    fireEvent.click(screen.getByTestId('tag-filter-vegetariskt'));

    expect(screen.getAllByTestId('recipe-item')).toHaveLength(1);
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.queryByText('Köttbullar')).not.toBeInTheDocument();
  });

  it('avaktiverar filtret när aktiv tagg klickas igen', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        { id: 1, name: 'Pasta', description: null, cook_time_minutes: null, servings: null, tags: ['vegetariskt'] },
        { id: 2, name: 'Köttbullar', description: null, cook_time_minutes: null, servings: null, tags: ['kött'] },
      ],
    });

    render(<MemoryRouter><RecipeList /></MemoryRouter>);
    await screen.findAllByTestId('recipe-item');

    fireEvent.click(screen.getByTestId('tag-filter-vegetariskt'));
    fireEvent.click(screen.getByTestId('tag-filter-vegetariskt'));

    expect(screen.getAllByTestId('recipe-item')).toHaveLength(2);
  });

  it('lenkar varje recept till dess detaljsida', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [{ id: 42, name: 'Pasta', description: null, cook_time_minutes: null, servings: null }],
    });

    render(
      <MemoryRouter>
        <RecipeList />
      </MemoryRouter>
    );

    const link = await screen.findByRole('link', { name: /Pasta/i });
    expect(link).toHaveAttribute('href', '/recipes/42');
  });
});
