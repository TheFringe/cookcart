import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { SettingsPage } from './SettingsPage';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  mockedAxios.get.mockResolvedValue({ data: [] });
});

function renderPage() {
  return render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>
  );
}

describe('SettingsPage', () => {
  it('renderar inställningssidan', () => {
    renderPage();

    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
  });

  it('visar en väljare för föredragen inköpslista', () => {
    renderPage();

    expect(screen.getByTestId('preferred-list-select')).toBeInTheDocument();
  });

  it('sparar vald lista i localStorage när användaren väljer', async () => {
    mockedAxios.get.mockResolvedValue({ data: [{ id: 3, name: 'Willys' }, { id: 7, name: 'ICA' }] });

    renderPage();

    const select = await screen.findByTestId('preferred-list-select');
    fireEvent.change(select, { target: { value: '7' } });

    expect(localStorage.getItem('recipes-preferred-list-id')).toBe('7');
  });
});
