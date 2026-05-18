import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { RecipeDetail } from './RecipeDetail';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

beforeEach(() => jest.clearAllMocks());

describe('RecipeDetail', () => {
  it('visar receptets namn när det laddats', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { id: 1, name: 'Pasta Carbonara', description: null, cook_time_minutes: null, servings: null, steps: [] },
    });

    render(
      <MemoryRouter initialEntries={['/recipes/1']}>
        <Routes>
          <Route path="/recipes/:id" element={<RecipeDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Pasta Carbonara')).toBeInTheDocument();
  });
});
