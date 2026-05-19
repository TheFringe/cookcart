import { Pool } from 'pg';
import { ShoppingListRepository } from './shopping-list.repository';

function makePool(...results: object[]): jest.Mocked<Pool> {
  const query = jest.fn();
  results.forEach((r) => query.mockResolvedValueOnce(r));
  return { query } as unknown as jest.Mocked<Pool>;
}

describe('ShoppingListRepository.updateItem', () => {
  it('returnerar den uppdaterade varan', async () => {
    const updated = { id: 10, quantity: 2, unit: 'kg', checked: true };
    const pool = makePool({ rows: [updated] });
    const repo = new ShoppingListRepository(pool);

    const result = await repo.updateItem(1, 10, { checked: true });

    expect(result).toEqual(updated);
  });
});

describe('ShoppingListRepository.findById', () => {
  it('returnerar listan med ingredienser i varje vara', async () => {
    const row = {
      id: 1,
      name: 'ICA',
      items: [
        { id: 10, ingredient: { id: 1, name: 'Mjölk' }, quantity: 1, unit: 'liter', checked: false },
      ],
    };
    const pool = makePool({ rows: [row] });
    const repo = new ShoppingListRepository(pool);

    const result = await repo.findById(1);

    expect(result).toEqual(row);
  });
});
