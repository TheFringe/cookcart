import { Pool } from 'pg';

export class IngredientRepository {
  constructor(private _pool: Pool) {}

  async findAll(): Promise<{ id: number; name: string }[]> {
    const { rows } = await this._pool.query(
      `SELECT id, name FROM ingredients ORDER BY name ASC`
    );
    return rows;
  }

  async normalizeNames(): Promise<void> {
    await this._pool.query(
      `UPDATE ingredients SET name = LOWER(name) WHERE name != LOWER(name)`
    );
  }
}
