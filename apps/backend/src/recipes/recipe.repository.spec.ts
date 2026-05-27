import { Pool, PoolClient } from 'pg';
import { RecipeRepository } from './recipe.repository';

function makeClient(...results: object[]): jest.Mocked<PoolClient> {
  const query = jest.fn();
  results.forEach((r) => query.mockResolvedValueOnce(r));
  return { query, release: jest.fn() } as unknown as jest.Mocked<PoolClient>;
}

function makePool(client: jest.Mocked<PoolClient>): jest.Mocked<Pool> {
  return { connect: jest.fn().mockResolvedValue(client) } as unknown as jest.Mocked<Pool>;
}

const baseRecipeRow = {
  id: 10, name: 'Pasta', description: null, steps: [],
  servings: null, cook_time_minutes: null,
  source_name: null, source_url: null, tags: [],
  created_at: new Date(), updated_at: new Date(),
};

describe('RecipeRepository.findAll', () => {
  it('hämtar recept sorterade i bokstavsordning', async () => {
    const client = makeClient({ rows: [] });
    const repo = new RecipeRepository(makePool(client));

    await repo.findAll();

    expect(client.query).toHaveBeenCalledWith(
      expect.stringMatching(/ORDER BY name/i)
    );
  });
});

describe('RecipeRepository.create — taggar', () => {
  it('sparar tags i recipes-tabellen', async () => {
    const recipeRow = { ...baseRecipeRow, tags: ['vegetariskt', 'pasta'] };
    const client = makeClient(
      { rows: [] },            // BEGIN
      { rows: [recipeRow] },   // INSERT recipe
      { rows: [] },            // COMMIT
    );
    const repo = new RecipeRepository(makePool(client));

    await repo.create({ name: 'Pasta', tags: ['vegetariskt', 'pasta'] });

    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining('tags'),
      expect.arrayContaining([['vegetariskt', 'pasta']])
    );
  });
});

describe('RecipeRepository.create — källa', () => {
  it('sparar source_name och source_url i recipes-tabellen', async () => {
    const recipeRow = { ...baseRecipeRow, source_name: 'Koket', source_url: 'https://koket.se/pasta' };
    const client = makeClient(
      { rows: [] },            // BEGIN
      { rows: [recipeRow] },   // INSERT recipe
      { rows: [] },            // COMMIT
    );
    const repo = new RecipeRepository(makePool(client));

    await repo.create({ name: 'Pasta', source_name: 'Koket', source_url: 'https://koket.se/pasta' });

    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining('source_name'),
      expect.arrayContaining(['Koket', 'https://koket.se/pasta'])
    );
  });
});

describe('RecipeRepository.create', () => {
  it('sparar ingredienser i recipe_ingredients när ett recept skapas', async () => {
    const ingredientRow = { id: 5, name: 'mjöl' };
    const client = makeClient(
      { rows: [] },               // BEGIN
      { rows: [baseRecipeRow] },  // INSERT recipe
      { rows: [ingredientRow] },  // batch upsert ingredients
      { rows: [] },               // batch INSERT recipe_ingredients
      { rows: [] },               // COMMIT
    );
    const repo = new RecipeRepository(makePool(client));

    await repo.create({ name: 'Pasta', ingredients: [{ name: 'mjöl', quantity: 2, unit: 'dl' }] });

    expect(client.query).toHaveBeenCalledTimes(5);
    expect(client.query).toHaveBeenNthCalledWith(
      4,
      expect.stringContaining('recipe_ingredients'),
      expect.anything()
    );
  });

  it('sparar null som quantity när ingrediensen saknar mängd', async () => {
    const ingredientRow = { id: 5, name: 'salt' };
    const client = makeClient(
      { rows: [] },               // BEGIN
      { rows: [baseRecipeRow] },  // INSERT recipe
      { rows: [ingredientRow] },  // batch upsert ingredients
      { rows: [] },               // batch INSERT recipe_ingredients
      { rows: [] },               // COMMIT
    );
    const repo = new RecipeRepository(makePool(client));

    await repo.create({ name: 'Pasta', ingredients: [{ name: 'salt', quantity: null, unit: '' }] });

    expect(client.query).toHaveBeenNthCalledWith(
      4,
      expect.stringContaining('recipe_ingredients'),
      expect.arrayContaining([[null]])
    );
  });

  it('normaliserar ingrediensnamn till lowercase innan de sparas', async () => {
    const ingredientRow = { id: 5, name: 'mjöl' };
    const client = makeClient(
      { rows: [] },               // BEGIN
      { rows: [baseRecipeRow] },  // INSERT recipe
      { rows: [ingredientRow] },  // batch upsert ingredients
      { rows: [] },               // batch INSERT recipe_ingredients
      { rows: [] },               // COMMIT
    );
    const repo = new RecipeRepository(makePool(client));

    await repo.create({ name: 'Pasta', ingredients: [{ name: 'Mjöl', quantity: 2, unit: 'dl', section: null }] });

    expect(client.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('ingredients'),
      [['mjöl']]
    );
  });

  it('sparar section_name i recipe_ingredients', async () => {
    const ingredientRow = { id: 5, name: 'basilika' };
    const client = makeClient(
      { rows: [] },               // BEGIN
      { rows: [baseRecipeRow] },  // INSERT recipe
      { rows: [ingredientRow] },  // batch upsert ingredients
      { rows: [] },               // batch INSERT recipe_ingredients
      { rows: [] },               // COMMIT
    );
    const repo = new RecipeRepository(makePool(client));

    await repo.create({ name: 'Pasta', ingredients: [{ name: 'basilika', quantity: 30, unit: 'g', section: 'Pesto' }] });

    expect(client.query).toHaveBeenNthCalledWith(
      4,
      expect.stringContaining('section_name'),
      expect.arrayContaining([['Pesto']])
    );
  });
});

describe('RecipeRepository.update', () => {
  it('ersätter ingredienser i recipe_ingredients när ett recept uppdateras', async () => {
    const ingredientRow = { id: 7, name: 'grädde' };
    const client = makeClient(
      { rows: [] },               // BEGIN
      { rows: [baseRecipeRow] },  // UPDATE recipe
      { rows: [] },               // DELETE recipe_ingredients
      { rows: [ingredientRow] },  // batch upsert ingredients
      { rows: [] },               // batch INSERT recipe_ingredients
      { rows: [] },               // COMMIT
    );
    const repo = new RecipeRepository(makePool(client));

    await repo.update(10, { name: 'Pasta', ingredients: [{ name: 'grädde', quantity: 1, unit: 'dl' }] });

    expect(client.query).toHaveBeenCalledTimes(6);
    expect(client.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('DELETE'),
      [10]
    );
    expect(client.query).toHaveBeenNthCalledWith(
      5,
      expect.stringContaining('recipe_ingredients'),
      expect.anything()
    );
  });

  it('rullar tillbaka transaktionen om ingredient-batch misslyckas', async () => {
    const client = makeClient(
      { rows: [] },               // BEGIN
      { rows: [baseRecipeRow] },  // UPDATE recipe
      { rows: [] },               // DELETE recipe_ingredients
    );
    client.query.mockRejectedValueOnce(new Error('DB-fel')); // batch upsert kraschar
    client.query.mockResolvedValueOnce({ rows: [] });        // ROLLBACK
    const repo = new RecipeRepository(makePool(client));

    await expect(
      repo.update(10, { name: 'Pasta', ingredients: [{ name: 'grädde', quantity: 1, unit: 'dl' }] })
    ).rejects.toThrow('DB-fel');

    expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    expect(client.release).toHaveBeenCalled();
  });
});

describe('RecipeRepository.findCookingProgress', () => {
  it('returnerar sparad progress för ett recept', async () => {
    const progressRow = { recipe_id: 1, checked_ingredients: ['pasta'], checked_steps: [0] };
    const client = makeClient({ rows: [progressRow] });
    const repo = new RecipeRepository(makePool(client));

    const result = await repo.findCookingProgress(1);

    expect(result).toEqual({ checked_ingredients: ['pasta'], checked_steps: [0] });
  });
});

describe('RecipeRepository.upsertCookingProgress', () => {
  it('sparar progress med upsert', async () => {
    const client = makeClient({ rows: [] });
    const repo = new RecipeRepository(makePool(client));

    await repo.upsertCookingProgress(1, { checked_ingredients: ['pasta'], checked_steps: [0, 2] });

    expect(client.query).toHaveBeenCalledWith(
      expect.stringMatching(/ON CONFLICT/i),
      [1, ['pasta'], [0, 2]]
    );
  });
});

describe('RecipeRepository.clearCookingProgress', () => {
  it('tar bort progress för ett recept', async () => {
    const client = makeClient({ rows: [] });
    const repo = new RecipeRepository(makePool(client));

    await repo.clearCookingProgress(1);

    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining('DELETE'),
      [1]
    );
  });
});

describe('RecipeRepository.findById', () => {
  it('returnerar quantity som number utan avslutande nollor', async () => {
    const recipeRow = { ...baseRecipeRow, id: 1, name: 'Pasta Carbonara', servings: 4, cook_time_minutes: 25 };
    const client = makeClient(
      { rows: [recipeRow] },
      { rows: [{ name: 'pasta', quantity: '1.50', unit: 'g' }] }
    );
    const repo = new RecipeRepository(makePool(client));

    const recipe = await repo.findById(1);

    expect(recipe?.ingredients[0].quantity).toBe(1.5);
  });

  it('returnerar receptet med ingredienser', async () => {
    const recipeRow = { ...baseRecipeRow, id: 1, name: 'Pasta Carbonara', servings: 4, cook_time_minutes: 25 };
    const ingredientRows = [
      { name: 'pasta', quantity: 200, unit: 'g' },
      { name: 'ägg', quantity: 2, unit: 'st' },
    ];
    const client = makeClient({ rows: [recipeRow] }, { rows: ingredientRows });
    const repo = new RecipeRepository(makePool(client));

    const recipe = await repo.findById(1);

    expect(recipe?.ingredients).toEqual([
      { name: 'pasta', quantity: 200, unit: 'g', section: null },
      { name: 'ägg', quantity: 2, unit: 'st', section: null },
    ]);
  });

  it('returnerar section_name på ingredienser', async () => {
    const recipeRow = { ...baseRecipeRow, id: 1, name: 'Pasta med pesto' };
    const ingredientRows = [
      { name: 'pasta', quantity: 200, unit: 'g', section_name: null },
      { name: 'basilika', quantity: 30, unit: 'g', section_name: 'Pesto' },
    ];
    const client = makeClient({ rows: [recipeRow] }, { rows: ingredientRows });
    const repo = new RecipeRepository(makePool(client));

    const recipe = await repo.findById(1);

    expect(recipe?.ingredients).toEqual([
      { name: 'pasta', quantity: 200, unit: 'g', section: null },
      { name: 'basilika', quantity: 30, unit: 'g', section: 'Pesto' },
    ]);
  });
});
