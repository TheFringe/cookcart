import request from 'supertest';
import express from 'express';
import { createMealPlanRouter } from './router';
import { MealPlanRepository } from './meal-plan.repository';

const mockRepo = {
  findByWeek: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
} as unknown as jest.Mocked<MealPlanRepository>;

const app = express();
app.use(express.json());
app.use('/meal-plan', createMealPlanRouter(mockRepo));
app.use((err: Error, _req: unknown, res: express.Response, _next: unknown) => {
  res.status(500).json({ error: err.message });
});

beforeEach(() => jest.clearAllMocks());

describe('POST /meal-plan', () => {
  it('returnerar 201 med den skapade posten', async () => {
    const entry = { id: 1, date: '2026-05-18', recipe: { id: 42, name: 'Pasta Carbonara' } };
    mockRepo.create.mockResolvedValue(entry);

    const res = await request(app)
      .post('/meal-plan')
      .send({ recipeId: 42, date: '2026-05-18' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(entry);
  });
});

describe('DELETE /meal-plan/:id', () => {
  it('returnerar 204 när posten tas bort', async () => {
    mockRepo.remove.mockResolvedValue(undefined);

    const res = await request(app).delete('/meal-plan/1');

    expect(res.status).toBe(204);
    expect(mockRepo.remove).toHaveBeenCalledWith(1);
  });
});

describe('GET /meal-plan', () => {
  it('returnerar poster för angiven vecka', async () => {
    const entry = { id: 1, date: '2026-05-18', recipe: { id: 42, name: 'Pasta Carbonara' } };
    mockRepo.findByWeek.mockResolvedValue([entry]);

    const res = await request(app).get('/meal-plan?week=2026-05-18');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([entry]);
    expect(mockRepo.findByWeek).toHaveBeenCalledWith('2026-05-18');
  });
});
