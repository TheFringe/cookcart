import { Pool } from 'pg';
import { IngredientRepository } from './ingredient.repository';

function makePool(...results: object[]): jest.Mocked<Pool> {
  const query = jest.fn();
  results.forEach((r) => query.mockResolvedValueOnce(r));
  return { query } as unknown as jest.Mocked<Pool>;
}

describe('IngredientRepository.normalizeNames', () => {
  it('lowercase:ar alla ingrediensnamn som inte redan är gemener', async () => {
    const pool = makePool({ rows: [], rowCount: 3 });
    const repo = new IngredientRepository(pool);

    await repo.normalizeNames();

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('LOWER(name)'),
    );
  });
});
