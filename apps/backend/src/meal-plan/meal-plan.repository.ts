import { Pool } from 'pg';

export class MealPlanRepository {
  constructor(private _pool: Pool) {}

  async remove(id: number): Promise<void> {
    await this._pool.query('DELETE FROM meal_plan WHERE id = $1', [id]);
  }

  async create(data: { recipeId: number; date: string }): Promise<unknown> {
    const { rows } = await this._pool.query(
      `INSERT INTO meal_plan (recipe_id, date)
       VALUES ($1, $2)
       RETURNING id,
                 date::text AS date,
                 (SELECT json_build_object('id', r.id, 'name', r.name)
                  FROM recipes r WHERE r.id = recipe_id) AS recipe`,
      [data.recipeId, data.date]
    );
    return rows[0];
  }

  async findByWeek(weekStart: string): Promise<unknown[]> {
    const { rows } = await this._pool.query(
      `SELECT mp.id,
              mp.date::text AS date,
              json_build_object('id', r.id, 'name', r.name) AS recipe
       FROM meal_plan mp
       JOIN recipes r ON r.id = mp.recipe_id
       WHERE mp.date >= $1 AND mp.date < ($1::date + interval '7 days')
       ORDER BY mp.date`,
      [weekStart]
    );
    return rows;
  }
}
