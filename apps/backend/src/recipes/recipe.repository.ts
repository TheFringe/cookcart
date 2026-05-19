import { Pool } from 'pg';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeInput {
  name: string;
  description?: string;
  steps?: string[];
  servings?: number;
  cook_time_minutes?: number;
}

export interface Recipe {
  id: number;
  name: string;
  description: string | null;
  steps: string[];
  servings: number | null;
  cook_time_minutes: number | null;
  ingredients: Ingredient[];
  created_at: Date;
  updated_at: Date;
}

export class RecipeRepository {
  constructor(private pool: Pool) {}

  async findAll(): Promise<Recipe[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM recipes ORDER BY created_at DESC'
    );
    return rows;
  }

  async findById(id: number): Promise<Recipe | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM recipes WHERE id = $1',
      [id]
    );
    if (!rows[0]) return null;

    const { rows: ingredientRows } = await this.pool.query(
      `SELECT i.name, ri.quantity, ri.unit
       FROM recipe_ingredients ri
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE ri.recipe_id = $1`,
      [id]
    );

    return { ...rows[0], ingredients: ingredientRows };
  }

  async update(id: number, data: RecipeInput): Promise<Recipe | null> {
    const { rows } = await this.pool.query(
      `UPDATE recipes
       SET name = $1, description = $2, steps = $3, servings = $4, cook_time_minutes = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [...this.toParams(data), id]
    );
    return rows[0] ?? null;
  }

  async create(data: RecipeInput): Promise<Recipe> {
    const { rows } = await this.pool.query(
      `INSERT INTO recipes (name, description, steps, servings, cook_time_minutes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      this.toParams(data)
    );
    return rows[0];
  }

  async remove(id: number): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      'DELETE FROM recipes WHERE id = $1',
      [id]
    );
    return (rowCount ?? 0) > 0;
  }

  private toParams(data: RecipeInput): (string | number | null)[] {
    return [
      data.name,
      data.description ?? null,
      JSON.stringify(data.steps ?? []),
      data.servings ?? null,
      data.cook_time_minutes ?? null,
    ];
  }
}
