import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { ShoppingListForm } from './ShoppingListForm';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

function renderForm(listId?: string) {
  return render(
    <MemoryRouter>
      <ShoppingListForm listId={listId} />
    </MemoryRouter>
  );
}

describe('ShoppingListForm — redigera', () => {
  it('förifylls med listans namn när listId skickas in', async () => {
    mockedAxios.get.mockResolvedValue({ data: { id: 1, name: 'ICA' } });

    renderForm('1');

    expect(await screen.findByDisplayValue('ICA')).toBeInTheDocument();
  });

  it('anropar PUT när formuläret skickas i redigera-läge', async () => {
    mockedAxios.get.mockResolvedValue({ data: { id: 1, name: 'ICA' } });
    mockedAxios.put.mockResolvedValue({ data: { id: 1 } });

    renderForm('1');
    await screen.findByDisplayValue('ICA');
    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining('/shopping-lists/1'),
      expect.objectContaining({ name: 'ICA' }),
      expect.any(Object)
    );
  });

  it('visar en avbryt-länk som leder tillbaka till listan', async () => {
    mockedAxios.get.mockResolvedValue({ data: { id: 1, name: 'ICA' } });

    renderForm('1');
    await screen.findByDisplayValue('ICA');

    expect(screen.getByRole('link', { name: /avbryt/i })).toHaveAttribute('href', '/shopping-lists/1');
  });
});

describe('ShoppingListForm — skapa', () => {
  it('renderar ett fält för namn', () => {
    renderForm();

    expect(screen.getByTestId('input-name')).toBeInTheDocument();
  });

  it('anropar POST med namn vid submit', () => {
    mockedAxios.post.mockResolvedValue({ data: { id: 1 } });

    renderForm();
    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'ICA' } });
    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/shopping-lists'),
      expect.objectContaining({ name: 'ICA' }),
      expect.any(Object)
    );
  });

  it('visar ett felmeddelande om POST misslyckas', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Nätverksfel'));

    renderForm();
    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'ICA' } });
    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByRole('status')).toBeInTheDocument();
  });
});
