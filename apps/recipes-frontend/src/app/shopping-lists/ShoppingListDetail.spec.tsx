import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { ShoppingListDetail } from './ShoppingListDetail';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

beforeEach(() => jest.clearAllMocks());

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ShoppingListDetail', () => {
  const listData = {
    id: 1,
    name: 'ICA',
    items: [
      { id: 10, ingredient: { id: 1, name: 'Mjölk' }, quantity: 1, unit: 'liter', checked: false },
      { id: 11, ingredient: { id: 2, name: 'Ägg' }, quantity: 12, unit: 'st', checked: false },
    ],
  };

  it('visar ingrediensnamnen i listan', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });

    renderAt('/shopping-lists/1');

    expect(await screen.findByText('Mjölk')).toBeInTheDocument();
    expect(screen.getByText('Ägg')).toBeInTheDocument();
  });

  it('anropar PATCH när en vara kryssas i', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });
    mockedAxios.patch.mockResolvedValue({ data: {} });

    renderAt('/shopping-lists/1');
    await screen.findByText('Mjölk');

    fireEvent.click(screen.getByRole('checkbox', { name: /Mjölk/i }));

    expect(mockedAxios.patch).toHaveBeenCalledWith(
      expect.stringContaining('/shopping-lists/1/items/10'),
      { checked: true },
      expect.any(Object)
    );
  });

  it('kryssad vara visas i plockade varor-sektionen och inte i aktiva varor', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });
    mockedAxios.patch.mockResolvedValue({ data: {} });

    renderAt('/shopping-lists/1');
    await screen.findByText('Mjölk');

    fireEvent.click(screen.getByRole('checkbox', { name: /Mjölk/i }));

    expect(within(screen.getByTestId('picked-items')).getByText('Mjölk')).toBeInTheDocument();
    expect(within(screen.getByTestId('active-items')).queryByText('Mjölk')).not.toBeInTheDocument();
  });
});
