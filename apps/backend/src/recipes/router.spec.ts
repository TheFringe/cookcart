import request from 'supertest';
import express from 'express';
import { createRecipesRouter } from './router';
import { RecipeRepository } from './recipe.repository';

const mockRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
} as unknown as RecipeRepository;

const app = express();
app.use(express.json());
app.use('/recipes', createRecipesRouter(mockRepo));
app.use((err: Error, _req: any, res: any, _next: any) => {
  res.status(500).json({ error: err.message });
});

beforeEach(() => jest.clearAllMocks());

describe('GET /recipes', () => {
  it('returnerar en tom lista', async () => {
    (mockRepo.findAll as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get('/recipes');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /recipes/:id', () => {
  it('returnerar receptet när det finns', async () => {
    const recipe = { id: 1, name: 'Pasta', description: null, steps: [], servings: 2, cook_time_minutes: 20 };
    (mockRepo.findById as jest.Mock).mockResolvedValue(recipe);

    const res = await request(app).get('/recipes/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(recipe);
  });
});

describe('PUT /recipes/:id', () => {
  it('returnerar 400 när name saknas', async () => {
    const res = await request(app)
      .put('/recipes/1')
      .send({ steps: ['Koka'] });

    expect(res.status).toBe(400);
  });

  it('returnerar det uppdaterade receptet', async () => {
    const update = { name: 'Pasta Bolognese', steps: ['Koka pasta', 'Stek köttfärs'], servings: 4 };
    const updated = { id: 1, ...update, description: null, cook_time_minutes: null };
    (mockRepo.update as jest.Mock).mockResolvedValue(updated);

    const res = await request(app).put('/recipes/1').send(update);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });
});

describe('DELETE /recipes/:id', () => {
  it('returnerar 204 när receptet tas bort', async () => {
    (mockRepo.remove as jest.Mock).mockResolvedValue(true);

    const res = await request(app).delete('/recipes/1');

    expect(res.status).toBe(204);
  });
});

describe('error handling', () => {
  it('returnerar 500 när repository kastar', async () => {
    (mockRepo.findAll as jest.Mock).mockRejectedValue(new Error('DB-fel'));

    const res = await request(app).get('/recipes');

    expect(res.status).toBe(500);
  });
});

describe('POST /recipes', () => {
  it('returnerar 400 när name saknas', async () => {
    const res = await request(app).post('/recipes').send({ steps: ['Koka'] });

    expect(res.status).toBe(400);
  });

  it('skapar ett recept och returnerar 201', async () => {
    const input = { name: 'Lasagne', steps: ['Koka pasta', 'Laga köttfärssås'], servings: 4 };
    const created = { id: 2, ...input, description: null, cook_time_minutes: null };
    (mockRepo.create as jest.Mock).mockResolvedValue(created);

    const res = await request(app).post('/recipes').send(input);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(created);
  });
});
