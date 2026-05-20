import request from 'supertest';
import express from 'express';
import { createIngredientsRouter } from './router';
import { IngredientRepository } from './ingredient.repository';

const mockRepo = {
  findAll: jest.fn(),
} as unknown as jest.Mocked<IngredientRepository>;

const app = express();
app.use(express.json());
app.use('/ingredients', createIngredientsRouter(mockRepo));

beforeEach(() => jest.clearAllMocks());

describe('GET /ingredients', () => {
  it('returnerar ingredienser sorterade i bokstavsordning', async () => {
    const ingredients = [
      { id: 1, name: 'Ägg' },
      { id: 2, name: 'Mjölk' },
    ];
    mockRepo.findAll.mockResolvedValue(ingredients);

    const res = await request(app).get('/ingredients');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(ingredients);
  });
});
