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

  async create(data: { name: string }): Promise<unknown> {
    const { rows } = await this._pool.query(
      'INSERT INTO shopping_lists (name) VALUES ($1) RETURNING *',
      [data.name]
    );
    return rows[0];
  }

  async update(id: number, data: { name: string }): Promise<unknown> {
    const { rows } = await this._pool.query(
      'UPDATE shopping_lists SET name = $1 WHERE id = $2 RETURNING *',
      [data.name, id]
    );
    return rows[0] ?? null;
  }

  async addItem(listId: number, data: { name: string; quantity: number; unit: string }): Promise<unknown> {
    const normalizedName = data.name.toLowerCase();
    const { rows: ingRows } = await this._pool.query(
      `INSERT INTO ingredients (name) VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [normalizedName]
    );
    const { rows } = await this._pool.query(
      `INSERT INTO shopping_list_items (list_id, ingredient_id, quantity, unit)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (list_id, ingredient_id)
       DO UPDATE SET quantity = shopping_list_items.quantity + EXCLUDED.quantity
       RETURNING id, quantity, unit, checked`,
      [listId, ingRows[0].id, data.quantity, data.unit]
    );
    return { ...rows[0], ingredient: { id: ingRows[0].id, name: normalizedName } };
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

  async removeItem(listId: number, itemId: number): Promise<void> {
    await this._pool.query(
      'DELETE FROM shopping_list_items WHERE id = $1 AND list_id = $2',
      [itemId, listId]
    );
  }

  async remove(id: number): Promise<void> {
    await this._pool.query('DELETE FROM shopping_lists WHERE id = $1', [id]);
  }
}
