import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { ShoppingList } from './ShoppingList';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

beforeEach(() => jest.clearAllMocks());

describe('ShoppingList', () => {
  it('visar laddningsindikator medan inköpslistan hämtas', () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {}));

    render(<ShoppingList id={1} />);

    expect(screen.getByText('Laddar inköpslista...')).toBeInTheDocument();
  });
});
