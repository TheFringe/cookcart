import { Pool } from 'pg';
import { RecipeRepository } from './recipe.repository';

function makePool(...results: object[]): jest.Mocked<Pool> {
  const query = jest.fn();
  results.forEach((r) => query.mockResolvedValueOnce(r));
  return { query } as unknown as jest.Mocked<Pool>;
}

describe('RecipeRepository.findById', () => {
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
