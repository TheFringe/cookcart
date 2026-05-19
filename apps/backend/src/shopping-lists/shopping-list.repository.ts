import { Pool } from 'pg';

export class ShoppingListRepository {
  constructor(private _pool: Pool) {}
  async findAll(): Promise<unknown[]> {
    const result = await this._pool.query('SELECT id, name FROM shopping_lists');
    return result.rows;
  }

  async findById(id: number): Promise<unknown> {
    const result = await this._pool.query(
      `SELECT sl.id, sl.name,
        COALESCE(
          json_agg(
            json_build_object(
              'id',         sli.id,
              'quantity',   sli.quantity,
              'unit',       sli.unit,
              'checked',    sli.checked,
              'ingredient', json_build_object('id', i.id, 'name', i.name)
            ) ORDER BY sli.id
          ) FILTER (WHERE sli.id IS NOT NULL),
          '[]'
        ) AS items
       FROM shopping_lists sl
       LEFT JOIN shopping_list_items sli ON sli.list_id = sl.id
       LEFT JOIN ingredients i           ON i.id = sli.ingredient_id
       WHERE sl.id = $1
       GROUP BY sl.id, sl.name`,
      [id]
    );
    return result.rows[0] ?? null;
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

  async updateItem(listId: number, itemId: number, data: { quantity?: number; unit?: string; checked?: boolean }): Promise<unknown> {
    const result = await this._pool.query(
      `UPDATE shopping_list_items
       SET checked  = COALESCE($1, checked),
           quantity = COALESCE($2, quantity),
           unit     = COALESCE($3, unit)
       WHERE id = $4 AND list_id = $5
       RETURNING id, quantity, unit, checked`,
      [data.checked ?? null, data.quantity ?? null, data.unit ?? null, itemId, listId]
    );
    return result.rows[0];
  }

  removeItem(_listId: number, _itemId: number): Promise<void> {
    throw new Error('not implemented');
  }

  remove(_id: number): Promise<void> {
    throw new Error('not implemented');
  }
}
