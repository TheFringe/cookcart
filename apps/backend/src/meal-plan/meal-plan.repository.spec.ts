import { Pool } from 'pg';
import { MealPlanRepository } from './meal-plan.repository';

function makePool(...results: object[]): jest.Mocked<Pool> {
  const query = jest.fn();
  results.forEach((r) => query.mockResolvedValueOnce(r));
  return { query } as unknown as jest.Mocked<Pool>;
}

describe('MealPlanRepository.remove', () => {
  it('tar bort en post', async () => {
    const pool = makePool({ rows: [], rowCount: 1 });
    const repo = new MealPlanRepository(pool);

    await repo.remove(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM meal_plan'),
      [1]
    );
  });
});

describe('MealPlanRepository.create', () => {
  it('infogar en ny post och returnerar den', async () => {
    const row = { id: 1, date: '2026-05-18', recipe: { id: 42, name: 'Pasta Carbonara' } };
    const pool = makePool({ rows: [row] });
    const repo = new MealPlanRepository(pool);

    const result = await repo.create({ recipeId: 42, date: '2026-05-18' });

    expect(result).toEqual(row);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO meal_plan'),
      [42, '2026-05-18']
    );
  });
});

describe('MealPlanRepository.findByWeek', () => {
  it('returnerar poster för den angivna veckan', async () => {
    const row = {
      id: 1,
      date: '2026-05-18',
      recipe: { id: 42, name: 'Pasta Carbonara' },
    };
    const pool = makePool({ rows: [row] });
    const repo = new MealPlanRepository(pool);

    const result = await repo.findByWeek('2026-05-18');

    expect(result).toEqual([row]);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT'),
      ['2026-05-18']
    );
  });
});
