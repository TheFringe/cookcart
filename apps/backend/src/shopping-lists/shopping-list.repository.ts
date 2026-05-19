import { Pool } from 'pg';

export class ShoppingListRepository {
  constructor(private _pool: Pool) {}
  async findAll(): Promise<unknown[]> {
    const result = await this._pool.query('SELECT id, name FROM shopping_lists');
    return result.rows;
  }

  findById(_id: number): Promise<unknown> {
    throw new Error('not implemented');
  }

  create(_data: { name: string }): Promise<unknown> {
    throw new Error('not implemented');
  }

  update(_id: number, _data: { name: string }): Promise<unknown> {
    throw new Error('not implemented');
  }

  addItem(_listId: number, _data: { ingredientId: number; quantity: number; unit: string }): Promise<unknown> {
    throw new Error('not implemented');
  }

  updateItem(_listId: number, _itemId: number, _data: { quantity?: number; unit?: string; checked?: boolean }): Promise<unknown> {
    throw new Error('not implemented');
  }

  removeItem(_listId: number, _itemId: number): Promise<void> {
    throw new Error('not implemented');
  }

  remove(_id: number): Promise<void> {
    throw new Error('not implemented');
  }
}
