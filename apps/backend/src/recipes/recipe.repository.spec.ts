import { Pool } from 'pg';
import { RecipeRepository } from './recipe.repository';

function makePool(...results: object[]): jest.Mocked<Pool> {
  const query = jest.fn();
  results.forEach((r) => query.mockResolvedValueOnce(r));
  return { query } as unknown as jest.Mocked<Pool>;
}

describe('RecipeRepository.findAll', () => {
  it('hämtar recept sorterade i bokstavsordning', async () => {
    const pool = makePool({ rows: [] });
    const repo = new RecipeRepository(pool);

    await repo.findAll();

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringMatching(/ORDER BY name/i)
    );
  });
});

describe('RecipeRepository.create — taggar', () => {
  it('sparar tags i recipes-tabellen', async () => {
    const recipeRow = {
      id: 10, name: 'Pasta', description: null, steps: [],
      servings: null, cook_time_minutes: null,
      source_name: null, source_url: null,
      tags: ['vegetariskt', 'pasta'],
      created_at: new Date(), updated_at: new Date(),
    };

    const pool = makePool({ rows: [recipeRow] });
    const repo = new RecipeRepository(pool);

    await repo.create({ name: 'Pasta', tags: ['vegetariskt', 'pasta'] });

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('tags'),
      expect.arrayContaining([['vegetariskt', 'pasta']])
    );
  });
});

describe('RecipeRepository.create — källa', () => {
  it('sparar source_name och source_url i recipes-tabellen', async () => {
    const recipeRow = {
      id: 10, name: 'Pasta', description: null, steps: [],
      servings: null, cook_time_minutes: null,
      source_name: 'Koket', source_url: 'https://koket.se/pasta',
      created_at: new Date(), updated_at: new Date(),
    };

    const pool = makePool({ rows: [recipeRow] });
    const repo = new RecipeRepository(pool);

    await repo.create({ name: 'Pasta', source_name: 'Koket', source_url: 'https://koket.se/pasta' });

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('source_name'),
      expect.arrayContaining(['Koket', 'https://koket.se/pasta'])
    );
  });
});

describe('RecipeRepository.create', () => {
  it('sparar ingredienser i recipe_ingredients när ett recept skapas', async () => {
    const recipeRow = {
      id: 10, name: 'Pasta', description: null, steps: [],
      servings: null, cook_time_minutes: null, created_at: new Date(), updated_at: new Date(),
    };
    const ingredientRow = { id: 5 };

    const pool = makePool(
      { rows: [recipeRow] },
      { rows: [ingredientRow] },
      { rows: [] },
    );
    const repo = new RecipeRepository(pool);

    await repo.create({ name: 'Pasta', ingredients: [{ name: 'mjöl', quantity: 2, unit: 'dl' }] });

    expect(pool.query).toHaveBeenCalledTimes(3);
    expect(pool.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('recipe_ingredients'),
      [10, 5, 2, 'dl']
    );
  });
});

describe('RecipeRepository.update', () => {
  it('ersätter ingredienser i recipe_ingredients när ett recept uppdateras', async () => {
    const recipeRow = {
      id: 10, name: 'Pasta', description: null, steps: [],
      servings: null, cook_time_minutes: null, created_at: new Date(), updated_at: new Date(),
    };
    const ingredientRow = { id: 7 };

    const pool = makePool(
      { rows: [recipeRow] },   // UPDATE recipe
      { rows: [] },            // DELETE recipe_ingredients
      { rows: [ingredientRow] }, // upsert ingredient
      { rows: [] },            // INSERT recipe_ingredient
    );
    const repo = new RecipeRepository(pool);

    await repo.update(10, { name: 'Pasta', ingredients: [{ name: 'grädde', quantity: 1, unit: 'dl' }] });

    expect(pool.query).toHaveBeenCalledTimes(4);
    expect(pool.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('DELETE'),
      [10]
    );
    expect(pool.query).toHaveBeenNthCalledWith(
      4,
      expect.stringContaining('recipe_ingredients'),
      [10, 7, 1, 'dl']
    );
  });
});

describe('RecipeRepository.findById', () => {
  it('returnerar quantity som number utan avslutande nollor', async () => {
    const recipeRow = {
      id: 1, name: 'Pasta Carbonara', description: null, steps: [],
      servings: 4, cook_time_minutes: 25, created_at: new Date(), updated_at: new Date(),
    };

    const pool = makePool(
      { rows: [recipeRow] },
      { rows: [{ name: 'pasta', quantity: '1.50', unit: 'g' }] }
    );
    const repo = new RecipeRepository(pool);

    const recipe = await repo.findById(1);

    expect(recipe?.ingredients[0].quantity).toBe(1.5);
  });

  it('returnerar receptet med ingredienser', async () => {
    const recipeRow = {
      id: 1,
      name: 'Pasta Carbonara',
      description: null,
      steps: [],
      servings: 4,
      cook_time_minutes: 25,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const ingredientRows = [
      { name: 'pasta', quantity: 200, unit: 'g' },
      { name: 'ägg', quantity: 2, unit: 'st' },
    ];

    const pool = makePool({ rows: [recipeRow] }, { rows: ingredientRows });
    const repo = new RecipeRepository(pool);

    const recipe = await repo.findById(1);

    expect(recipe?.ingredients).toEqual([
      { name: 'pasta', quantity: 200, unit: 'g' },
      { name: 'ägg', quantity: 2, unit: 'st' },
    ]);
  });
});
