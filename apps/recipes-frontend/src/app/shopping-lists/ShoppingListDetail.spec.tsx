import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
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

  it('visar en listväljare med alla inköpslistor', async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/ingredients')) return Promise.resolve({ data: [] });
      if (/\/shopping-lists\/\d+$/.test(url)) return Promise.resolve({ data: listData });
      return Promise.resolve({ data: [{ id: 1, name: 'ICA' }, { id: 2, name: 'Willys' }] });
    });

    renderAt('/shopping-lists/1');
    await screen.findByTestId('shopping-list-detail');

    expect(screen.getByTestId('list-selector')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'ICA' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Willys' })).toBeInTheDocument();
  });

  it('visar ingrediensnamnen i listan', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });

    renderAt('/shopping-lists/1');

    expect(await screen.findByText('Mjölk')).toBeInTheDocument();
    expect(screen.getByText('Ägg')).toBeInTheDocument();
  });

  it('tar bort en vara när ta bort-knappen klickas', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });
    mockedAxios.delete.mockResolvedValue({});

    renderAt('/shopping-lists/1');
    await screen.findByText('Mjölk');

    fireEvent.click(screen.getByTestId('delete-item-10'));

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/shopping-lists/1/items/10'),
      expect.any(Object)
    );
    expect(screen.queryByText('Mjölk')).not.toBeInTheDocument();
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

  it('visar en länk för att skapa ny lista mellan redigera och radera', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });

    renderAt('/shopping-lists/1');
    await screen.findByText('ICA');

    const newListLink = screen.getByTestId('new-list-btn');
    expect(newListLink).toHaveAttribute('href', '/shopping-lists/new');

    const nav = screen.getByTestId('list-detail-nav');
    const testIds = Array.from(nav.querySelectorAll('[data-testid]')).map((el) => el.getAttribute('data-testid'));
    expect(testIds.indexOf('new-list-btn')).toBeGreaterThan(testIds.indexOf('list-selector'));
    expect(testIds.indexOf('new-list-btn')).toBeLessThan(testIds.indexOf('delete-list-btn'));
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

  it('visar ingrediensförslag i en datalist när komponenten laddas', async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/ingredients')) return Promise.resolve({ data: [{ id: 1, name: 'Mjölk' }, { id: 2, name: 'Smör' }] });
      return Promise.resolve({ data: listData });
    });

    renderAt('/shopping-lists/1');
    await screen.findByText('ICA');

    const input = screen.getByTestId('add-item-name') as HTMLInputElement;
    expect(input.getAttribute('list')).toBe('ingredients-suggestions');
    expect(document.getElementById('ingredients-suggestions')).toBeInTheDocument();
  });

  it('datalist visar bara förslag som börjar med det inmatade värdet', async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/ingredients'))
        return Promise.resolve({ data: [{ id: 1, name: 'Mjölk' }, { id: 2, name: 'Smör' }, { id: 3, name: 'Smörkräm' }] });
      return Promise.resolve({ data: listData });
    });

    renderAt('/shopping-lists/1');
    await screen.findByText('ICA');

    fireEvent.change(screen.getByTestId('add-item-name'), { target: { value: 'Sm' } });

    const datalist = document.getElementById('ingredients-suggestions')!;
    const options = Array.from(datalist.querySelectorAll('option')).map((o) => o.getAttribute('value'));
    expect(options).toEqual(['Smör', 'Smörkräm']);
    expect(options).not.toContain('Mjölk');
  });

  it('visar bekräftelsedialog när töm-knappen klickas', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });

    renderAt('/shopping-lists/1');
    await screen.findByText('Mjölk');

    fireEvent.click(screen.getByTestId('clear-list-btn'));

    expect(screen.getByTestId('clear-confirm-dialog')).toBeInTheDocument();
    expect(mockedAxios.delete).not.toHaveBeenCalled();
  });

  it('stänger bekräftelsedialogens när avbryt klickas', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });

    renderAt('/shopping-lists/1');
    await screen.findByText('Mjölk');

    fireEvent.click(screen.getByTestId('clear-list-btn'));
    fireEvent.click(screen.getByTestId('clear-cancel-btn'));

    expect(screen.queryByTestId('clear-confirm-dialog')).not.toBeInTheDocument();
    expect(mockedAxios.delete).not.toHaveBeenCalled();
  });

  it('tömmer listan när bekräftelse klickas', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });
    mockedAxios.delete.mockResolvedValue({});

    renderAt('/shopping-lists/1');
    await screen.findByText('Mjölk');

    fireEvent.click(screen.getByTestId('clear-list-btn'));
    fireEvent.click(screen.getByTestId('clear-confirm-btn'));

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/shopping-lists/1/items'),
      expect.any(Object)
    );
    expect(screen.queryByText('Mjölk')).not.toBeInTheDocument();
    expect(screen.queryByText('Ägg')).not.toBeInTheDocument();
  });

  it('visar felmeddelande när töm lista misslyckas', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });
    mockedAxios.delete.mockRejectedValue({ response: { status: 500 } });

    renderAt('/shopping-lists/1');
    await screen.findByText('Mjölk');

    fireEvent.click(screen.getByTestId('clear-list-btn'));
    fireEvent.click(screen.getByTestId('clear-confirm-btn'));

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Mjölk')).toBeInTheDocument();
  });

  it('anropar DELETE och navigerar till listan när radera bekräftas', async () => {
    const mockNavigate = jest.fn();
    jest.mocked(useNavigate).mockReturnValue(mockNavigate);
    mockedAxios.get.mockResolvedValue({ data: listData });
    mockedAxios.delete.mockResolvedValue({});

    renderAt('/shopping-lists/1');
    await screen.findByText('ICA');

    fireEvent.click(screen.getByTestId('delete-list-btn'));
    fireEvent.click(screen.getByTestId('delete-list-confirm-btn'));

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/shopping-lists/1'),
      expect.any(Object)
    );
    await screen.findByText('ICA');
    expect(mockNavigate).toHaveBeenCalledWith('/shopping-lists');
  });

  it('visar felmeddelande när radera inköpslista misslyckas', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });
    mockedAxios.delete.mockRejectedValue({ response: { status: 500 } });

    renderAt('/shopping-lists/1');
    await screen.findByText('ICA');

    fireEvent.click(screen.getByTestId('delete-list-btn'));
    fireEvent.click(screen.getByTestId('delete-list-confirm-btn'));

    expect(await screen.findByRole('status')).toBeInTheDocument();
  });

  it('visar mängd och enhet för varje vara', async () => {
    mockedAxios.get.mockResolvedValue({ data: listData });

    renderAt('/shopping-lists/1');
    await screen.findByText('Mjölk');

    expect(screen.getByTestId('item-quantity-10')).toHaveTextContent('1 liter');
    expect(screen.getByTestId('item-quantity-11')).toHaveTextContent('12 st');
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
