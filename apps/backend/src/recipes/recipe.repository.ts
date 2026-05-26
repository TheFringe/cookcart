import { Pool, QueryResult } from 'pg';

export interface Ingredient {
  name: string;
  quantity: number | null;
  unit: string;
}

export interface RecipeInput {
  name: string;
  description?: string;
  steps?: string[];
  servings?: number;
  cook_time_minutes?: number;
  source_name?: string;
  source_url?: string;
  tags?: string[];
  ingredients?: Ingredient[];
}

export interface Recipe {
  id: number;
  name: string;
  description: string | null;
  steps: string[];
  servings: number | null;
  cook_time_minutes: number | null;
  source_name: string | null;
  source_url: string | null;
  tags: string[];
  ingredients: Ingredient[];
  created_at: Date;
  updated_at: Date;
}

type QueryFn = (sql: string, params?: unknown[]) => Promise<QueryResult>;

export class RecipeRepository {
  constructor(private pool: Pool) {}

  async findAll(): Promise<Recipe[]> {
    const client = await this.pool.connect();
    const { rows } = await client.query('SELECT * FROM recipes ORDER BY name ASC');
    client.release();
    return rows;
  }

  async findById(id: number): Promise<Recipe | null> {
    const client = await this.pool.connect();
    const { rows } = await client.query('SELECT * FROM recipes WHERE id = $1', [id]);
    if (!rows[0]) { client.release(); return null; }

    const { rows: ingredientRows } = await client.query(
      `SELECT i.name, ri.quantity, ri.unit
       FROM recipe_ingredients ri
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE ri.recipe_id = $1`,
      [id]
    );
    client.release();

    const ingredients: Ingredient[] = ingredientRows.map((row) => ({
      name: row.name,
      unit: row.unit,
      quantity: row.quantity != null ? parseFloat(row.quantity) : null,
    }));

    return { ...rows[0], ingredients };
  }

  async create(data: RecipeInput): Promise<Recipe> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(
        `INSERT INTO recipes (name, description, steps, servings, cook_time_minutes, source_name, source_url, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        this.toParams(data)
      );
      await this.saveIngredients(rows[0].id, data.ingredients ?? [], (sql, p) => client.query(sql, p));
      await client.query('COMMIT');
      return rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async update(id: number, data: RecipeInput): Promise<Recipe | null> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(
        `UPDATE recipes
         SET name = $1, description = $2, steps = $3, servings = $4, cook_time_minutes = $5,
             source_name = $6, source_url = $7, tags = $8, updated_at = NOW()
         WHERE id = $9
         RETURNING *`,
        [...this.toParams(data), id]
      );
      if (!rows[0]) { await client.query('ROLLBACK'); return null; }
      await client.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [id]);
      await this.saveIngredients(id, data.ingredients ?? [], (sql, p) => client.query(sql, p));
      await client.query('COMMIT');
      return rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async findCookingProgress(recipeId: number): Promise<{ checked_ingredients: string[]; checked_steps: number[] }> {
    const client = await this.pool.connect();
    const { rows } = await client.query(
      'SELECT checked_ingredients, checked_steps FROM recipe_cooking_progress WHERE recipe_id = $1',
      [recipeId]
    );
    client.release();
    if (!rows[0]) return { checked_ingredients: [], checked_steps: [] };
    return { checked_ingredients: rows[0].checked_ingredients, checked_steps: rows[0].checked_steps };
  }

  async upsertCookingProgress(recipeId: number, data: { checked_ingredients: string[]; checked_steps: number[] }): Promise<void> {
    const client = await this.pool.connect();
    await client.query(
      `INSERT INTO recipe_cooking_progress (recipe_id, checked_ingredients, checked_steps)
       VALUES ($1, $2, $3)
       ON CONFLICT (recipe_id)
       DO UPDATE SET checked_ingredients = EXCLUDED.checked_ingredients, checked_steps = EXCLUDED.checked_steps`,
      [recipeId, data.checked_ingredients, data.checked_steps]
    );
    client.release();
  }

  async clearCookingProgress(recipeId: number): Promise<void> {
    const client = await this.pool.connect();
    await client.query('DELETE FROM recipe_cooking_progress WHERE recipe_id = $1', [recipeId]);
    client.release();
  }

  async remove(id: number): Promise<boolean> {
    const client = await this.pool.connect();
    const { rowCount } = await client.query('DELETE FROM recipes WHERE id = $1', [id]);
    client.release();
    return (rowCount ?? 0) > 0;
  }

  private async saveIngredients(recipeId: number, ingredients: Ingredient[], query: QueryFn): Promise<void> {
    if (ingredients.length === 0) return;
    const names = ingredients.map((i) => i.name.toLowerCase());

    const { rows } = await query(
      `INSERT INTO ingredients (name) SELECT unnest($1::text[])
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name`,
      [names]
    );

    const nameToId = new Map(rows.map((r: { id: number; name: string }) => [r.name, r.id]));

    await query(
      `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
       SELECT $1, unnest($2::int[]), unnest($3::float8[]), unnest($4::text[])`,
      [
        recipeId,
        names.map((n) => nameToId.get(n)),
        ingredients.map((i) => i.quantity),
        ingredients.map((i) => i.unit),
      ]
    );
  }

  private toParams(data: RecipeInput): (string | number | null | string[])[] {
    return [
      data.name,
      data.description ?? null,
      JSON.stringify(data.steps ?? []),
      data.servings ?? null,
      data.cook_time_minutes ?? null,
      data.source_name ?? null,
      data.source_url ?? null,
      data.tags ?? [],
    ];
  }
}
