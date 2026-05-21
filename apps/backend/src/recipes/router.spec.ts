import request from 'supertest';
import express from 'express';
import { createRecipesRouter } from './router';
import { RecipeRepository } from './recipe.repository';
import * as importModule from './import';

jest.mock('./import');

const mockRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findCookingProgress: jest.fn(),
  upsertCookingProgress: jest.fn(),
  clearCookingProgress: jest.fn(),
} as unknown as jest.Mocked<RecipeRepository>;

const app = express();
app.use(express.json());
app.use('/recipes', createRecipesRouter(mockRepo));
app.use((err: Error, _req: any, res: any, _next: any) => {
  res.status(500).json({ error: err.message });
});

beforeEach(() => jest.clearAllMocks());

describe('GET /recipes', () => {
  it('returnerar en tom lista', async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const res = await request(app).get('/recipes');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /recipes/:id', () => {
  it('returnerar 400 för icke-numeriskt id', async () => {
    const res = await request(app).get('/recipes/abc');

    expect(res.status).toBe(400);
  });

  it('returnerar receptet när det finns', async () => {
    const recipe = { id: 1, name: 'Pasta', description: null, steps: [], servings: 2, cook_time_minutes: 20, ingredients: [] };
    mockRepo.findById.mockResolvedValue(recipe);

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
    mockRepo.update.mockResolvedValue(updated);

    const res = await request(app).put('/recipes/1').send(update);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });
});

describe('DELETE /recipes/:id', () => {
  it('returnerar 204 när receptet tas bort', async () => {
    mockRepo.remove.mockResolvedValue(true);

    const res = await request(app).delete('/recipes/1');

    expect(res.status).toBe(204);
  });
});

describe('error handling', () => {
  it('returnerar 500 när repository kastar', async () => {
    mockRepo.findAll.mockRejectedValue(new Error('DB-fel'));

    const res = await request(app).get('/recipes');

    expect(res.status).toBe(500);
  });
});

describe('GET /recipes/:id/cooking-progress', () => {
  it('returnerar sparad progress', async () => {
    const progress = { checked_ingredients: ['pasta'], checked_steps: [0] };
    mockRepo.findCookingProgress.mockResolvedValue(progress);

    const res = await request(app).get('/recipes/1/cooking-progress');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(progress);
  });
});

describe('PUT /recipes/:id/cooking-progress', () => {
  it('sparar progress och returnerar 204', async () => {
    mockRepo.upsertCookingProgress.mockResolvedValue(undefined);

    const res = await request(app)
      .put('/recipes/1/cooking-progress')
      .send({ checked_ingredients: ['pasta'], checked_steps: [0] });

    expect(res.status).toBe(204);
    expect(mockRepo.upsertCookingProgress).toHaveBeenCalledWith(1, {
      checked_ingredients: ['pasta'],
      checked_steps: [0],
    });
  });
});

describe('DELETE /recipes/:id/cooking-progress', () => {
  it('tar bort progress och returnerar 204', async () => {
    mockRepo.clearCookingProgress.mockResolvedValue(undefined);

    const res = await request(app).delete('/recipes/1/cooking-progress');

    expect(res.status).toBe(204);
    expect(mockRepo.clearCookingProgress).toHaveBeenCalledWith(1);
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
    mockRepo.create.mockResolvedValue(created);

    const res = await request(app).post('/recipes').send(input);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(created);
  });

  it('skickar källa (source_name och source_url) till repository', async () => {
    const input = { name: 'Pasta', source_name: 'Koket', source_url: 'https://koket.se/pasta' };
    const created = { id: 3, ...input, description: null, steps: [], cook_time_minutes: null, servings: null };
    mockRepo.create.mockResolvedValue(created);

    const res = await request(app).post('/recipes').send(input);

    expect(res.status).toBe(201);
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      source_name: 'Koket',
      source_url: 'https://koket.se/pasta',
    }));
  });
});

describe('POST /recipes/import', () => {
  it('returnerar 400 när url saknas', async () => {
    const res = await request(app).post('/recipes/import').send({});

    expect(res.status).toBe(400);
  });

  it('returnerar parsad receptdata för en giltig url', async () => {
    const parsed = { name: 'Pasta', steps: ['Koka'], ingredients: [] };
    jest.spyOn(importModule, 'parseRecipeFromUrl').mockResolvedValue(parsed);

    const res = await request(app)
      .post('/recipes/import')
      .send({ url: 'https://koket.se/pasta' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Pasta');
  });

  it('returnerar 422 när ingen receptschema hittas', async () => {
    jest.spyOn(importModule, 'parseRecipeFromUrl').mockRejectedValue(new Error('Inget recept hittades på sidan'));

    const res = await request(app)
      .post('/recipes/import')
      .send({ url: 'https://example.com' });

    expect(res.status).toBe(422);
  });

  it('returnerar 502 när hämtning av sidan misslyckas', async () => {
    const axiosError = Object.assign(new Error('Network error'), { response: { status: 404 } });
    jest.spyOn(importModule, 'parseRecipeFromUrl').mockRejectedValue(axiosError);

    const res = await request(app)
      .post('/recipes/import')
      .send({ url: 'https://example.com/nonexistent' });

    expect(res.status).toBe(502);
  });
});
