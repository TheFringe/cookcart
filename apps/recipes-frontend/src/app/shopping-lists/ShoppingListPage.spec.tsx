import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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

    render(<MemoryRouter><ShoppingListPage /></MemoryRouter>);

    expect(await screen.findByText('ICA')).toBeInTheDocument();
  });

  it('varje lista är en länk till sin detaljsida', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [{ id: 3, name: 'Hemköp' }],
    });

    render(<MemoryRouter><ShoppingListPage /></MemoryRouter>);

    const link = await screen.findByRole('link', { name: /Hemköp/i });
    expect(link).toHaveAttribute('href', '/shopping-lists/3');
  });

  it('visar en toast när hämtningen misslyckas', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    render(<ShoppingListPage />);

    expect(await screen.findByRole('status')).toHaveTextContent('Kunde inte ladda inköpslistorna.');
  });
});
