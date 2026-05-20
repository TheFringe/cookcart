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

  it('visar en redigera-länk till redigeringssidan', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });

    renderAt('/shopping-lists/1');
    await screen.findByText('ICA');

    expect(screen.getByRole('link', { name: /redigera/i })).toHaveAttribute('href', '/shopping-lists/1/edit');
  });

  it('visar ett formulär för att lägga till vara', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });

    renderAt('/shopping-lists/1');
    await screen.findByText('ICA');

    expect(screen.getByTestId('add-item-name')).toBeInTheDocument();
    expect(screen.getByTestId('add-item-btn')).toBeInTheDocument();
  });

  it('anropar POST när en vara läggs till via formuläret', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });
    mockedAxios.post.mockResolvedValue({
      data: { id: 99, ingredient: { id: 5, name: 'Smör' }, quantity: 1, unit: 'st', checked: false },
    });

    renderAt('/shopping-lists/1');
    await screen.findByText('ICA');

    fireEvent.change(screen.getByTestId('add-item-name'), { target: { value: 'Smör' } });
    fireEvent.click(screen.getByTestId('add-item-btn'));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/shopping-lists/1/items'),
      expect.objectContaining({ name: 'Smör' }),
      expect.any(Object)
    );
  });

  it('ny vara hamnar överst i listan av aktiva varor', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });
    mockedAxios.post.mockResolvedValue({
      data: { id: 99, ingredient: { id: 5, name: 'Smör' }, quantity: 1, unit: 'st', checked: false },
    });

    renderAt('/shopping-lists/1');
    await screen.findByText('Mjölk');

    fireEvent.change(screen.getByTestId('add-item-name'), { target: { value: 'Smör' } });
    fireEvent.click(screen.getByTestId('add-item-btn'));

    await screen.findByText('Smör');
    const [first] = screen.getAllByRole('checkbox');
    expect(first).toHaveAccessibleName('Smör');
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
