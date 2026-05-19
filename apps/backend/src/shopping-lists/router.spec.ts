import request from 'supertest';
import express from 'express';
import { createShoppingListsRouter } from './router';
import { ShoppingListRepository } from './shopping-list.repository';

const mockRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  addItem: jest.fn(),
  updateItem: jest.fn(),
  removeItem: jest.fn(),
} as unknown as jest.Mocked<ShoppingListRepository>;

const app = express();
app.use(express.json());
app.use('/shopping-lists', createShoppingListsRouter(mockRepo));
app.use((err: Error, _req: any, res: any, _next: any) => {
  res.status(500).json({ error: err.message });
});

beforeEach(() => jest.clearAllMocks());

describe('GET /shopping-lists', () => {
  it('returnerar en tom lista', async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const res = await request(app).get('/shopping-lists');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /shopping-lists/:id', () => {
  it('returnerar listan med det givna id:t', async () => {
    const list = { id: 1, name: 'ICA', items: [] };
    mockRepo.findById.mockResolvedValue(list);

    const res = await request(app).get('/shopping-lists/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(list);
  });

  it('returnerar 404 när listan inte finns', async () => {
    mockRepo.findById.mockResolvedValue(null);

    const res = await request(app).get('/shopping-lists/999');

    expect(res.status).toBe(404);
  });
});

describe('PATCH /shopping-lists/:id/items/:itemId', () => {
  it('returnerar 200 med den uppdaterade varan', async () => {
    const updated = { id: 5, ingredientId: 2, quantity: 2, unit: 'kg', checked: false };
    mockRepo.updateItem.mockResolvedValue(updated);

    const res = await request(app)
      .patch('/shopping-lists/1/items/5')
      .send({ quantity: 2, unit: 'kg' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });
});

describe('DELETE /shopping-lists/:id/items/:itemId', () => {
  it('returnerar 204 när varan tas bort', async () => {
    mockRepo.removeItem.mockResolvedValue(undefined);

    const res = await request(app).delete('/shopping-lists/1/items/5');

    expect(res.status).toBe(204);
  });
});

describe('POST /shopping-lists/:id/items', () => {
  it('returnerar 201 med den tillagda varan', async () => {
    const item = { id: 1, ingredientId: 2, quantity: 1, unit: 'st' };
    mockRepo.addItem.mockResolvedValue(item);

    const res = await request(app)
      .post('/shopping-lists/1/items')
      .send({ ingredientId: 2, quantity: 1, unit: 'st' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(item);
  });
});

describe('PUT /shopping-lists/:id', () => {
  it('returnerar 200 med den uppdaterade listan', async () => {
    const updated = { id: 1, name: 'ICA Maxi' };
    mockRepo.update.mockResolvedValue(updated);

    const res = await request(app).put('/shopping-lists/1').send({ name: 'ICA Maxi' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });
});

describe('DELETE /shopping-lists/:id', () => {
  it('returnerar 204 när listan tas bort', async () => {
    mockRepo.remove.mockResolvedValue(undefined);

    const res = await request(app).delete('/shopping-lists/1');

    expect(res.status).toBe(204);
  });
});

describe('POST /shopping-lists', () => {
  it('returnerar 400 när name saknas', async () => {
    const res = await request(app).post('/shopping-lists').send({});

    expect(res.status).toBe(400);
  });

  it('returnerar 201 med den skapade listan', async () => {
    const created = { id: 1, name: 'ICA' };
    mockRepo.create.mockResolvedValue(created);

    const res = await request(app).post('/shopping-lists').send({ name: 'ICA' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(created);
  });
});
