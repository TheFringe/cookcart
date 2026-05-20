import { Pool } from 'pg';
import { ShoppingListRepository } from './shopping-list.repository';

function makePool(...results: object[]): jest.Mocked<Pool> {
  const query = jest.fn();
  results.forEach((r) => query.mockResolvedValueOnce(r));
  return { query } as unknown as jest.Mocked<Pool>;
}

describe('ShoppingListRepository.create', () => {
  it('infogar en ny inköpslista och returnerar den', async () => {
    const row = { id: 1, name: 'ICA' };
    const pool = makePool({ rows: [row] });
    const repo = new ShoppingListRepository(pool);

    const result = await repo.create({ name: 'ICA' });

    expect(result).toEqual(row);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO shopping_lists'),
      ['ICA']
    );
  });
});

describe('ShoppingListRepository.update', () => {
  it('uppdaterar inköpslistans namn och returnerar den', async () => {
    const row = { id: 1, name: 'Willys' };
    const pool = makePool({ rows: [row] });
    const repo = new ShoppingListRepository(pool);

    const result = await repo.update(1, { name: 'Willys' });

    expect(result).toEqual(row);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE shopping_lists'),
      ['Willys', 1]
    );
  });
});

describe('ShoppingListRepository.addItem', () => {
  it('upserterar ingrediens och infogar en vara i listan', async () => {
    const ingredientRow = { id: 5 };
    const itemRow = { id: 99, quantity: 2, unit: 'st', checked: false };
    const pool = makePool({ rows: [ingredientRow] }, { rows: [itemRow] });
    const repo = new ShoppingListRepository(pool);

    const result = await repo.addItem(1, { name: 'Mjölk', quantity: 2, unit: 'st' });

    expect(result).toEqual({ ...itemRow, ingredient: { id: 5, name: 'mjölk' } });
    expect(pool.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('INSERT INTO ingredients'),
      ['mjölk']
    );
    expect(pool.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('INSERT INTO shopping_list_items'),
      [1, 5, 2, 'st']
    );
  });

  it('behandlar KÖTTfärs och köttfärs som samma ingrediens', async () => {
    const ingredientRow = { id: 7 };
    const itemRow = { id: 100, quantity: 1, unit: 'kg', checked: false };
    const pool = makePool({ rows: [ingredientRow] }, { rows: [itemRow] });
    const repo = new ShoppingListRepository(pool);

    const result = await repo.addItem(1, { name: 'KÖTTfärs', quantity: 1, unit: 'kg' });

    expect(pool.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('INSERT INTO ingredients'),
      ['köttfärs']
    );
    expect(result).toEqual({ ...itemRow, ingredient: { id: 7, name: 'köttfärs' } });
  });
});

describe('ShoppingListRepository.removeItem', () => {
  it('tar bort en vara från listan', async () => {
    const pool = makePool({ rows: [], rowCount: 1 });
    const repo = new ShoppingListRepository(pool);

    await repo.removeItem(1, 10);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM shopping_list_items'),
      [10, 1]
    );
  });
});

describe('ShoppingListRepository.remove', () => {
  it('tar bort en inköpslista', async () => {
    const pool = makePool({ rows: [], rowCount: 1 });
    const repo = new ShoppingListRepository(pool);

    await repo.remove(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM shopping_lists'),
      [1]
    );
  });
});

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
