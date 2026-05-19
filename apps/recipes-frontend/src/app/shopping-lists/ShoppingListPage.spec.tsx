import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { ShoppingListPage } from './ShoppingListPage';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

beforeEach(() => jest.clearAllMocks());

describe('ShoppingListPage', () => {
  it('visar alla inköpslistors namn efter hämtning', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        { id: 1, name: 'ICA' },
        { id: 2, name: 'Willys' },
      ],
    });

    render(<ShoppingListPage />);

    expect(await screen.findByText('ICA')).toBeInTheDocument();
  });

  it('visar en toast när hämtningen misslyckas', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    render(<ShoppingListPage />);

    expect(await screen.findByRole('status')).toHaveTextContent('Kunde inte ladda inköpslistorna.');
  });
});
