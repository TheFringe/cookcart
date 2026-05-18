import { Pool } from 'pg';

export interface RecipeInput {
  name: string;
  description?: string;
  steps?: string[];
  servings?: number;
  cook_time_minutes?: number;
}

export class RecipeRepository {
  constructor(private pool: Pool) {}

  async findAll() {
    const { rows } = await this.pool.query(
      'SELECT * FROM recipes ORDER BY created_at DESC'
    );
    return rows;
  }

  async findById(id: number) {
    const { rows } = await this.pool.query(
      'SELECT * FROM recipes WHERE id = $1',
      [id]
    );
    return rows[0] ?? null;
  }

  async update(id: number, data: RecipeInput) {
    const { rows } = await this.pool.query(
      `UPDATE recipes
       SET name = $1, description = $2, steps = $3, servings = $4, cook_time_minutes = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [...this.toParams(data), id]
    );
    return rows[0] ?? null;
  }

  async create(data: RecipeInput) {
    const { rows } = await this.pool.query(
      `INSERT INTO recipes (name, description, steps, servings, cook_time_minutes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      this.toParams(data)
    );
    return rows[0];
  }

  async remove(id: number) {
    const { rowCount } = await this.pool.query(
      'DELETE FROM recipes WHERE id = $1',
      [id]
    );
    return (rowCount ?? 0) > 0;
  }

  private toParams(data: RecipeInput) {
    return [
      data.name,
      data.description ?? null,
      JSON.stringify(data.steps ?? []),
      data.servings ?? null,
      data.cook_time_minutes ?? null,
    ];
  }
}
