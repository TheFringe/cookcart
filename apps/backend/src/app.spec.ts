jest.mock('./db', () => ({
  pool: {
    query: jest.fn().mockResolvedValue({ rows: [] }),
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      release: jest.fn(),
    }),
    on: jest.fn(),
  },
}));
jest.mock('passport-google-oauth20', () => ({
  Strategy: jest.fn().mockImplementation(() => ({ name: 'google' })),
}));
jest.mock('connect-pg-simple', () => () => class {});
jest.mock('express-session', () => () => (req: any, _res: any, next: any) => {
  req.session = {};
  req.user = { id: 1, email: 'test@example.com', name: 'Test' };
  next();
});

import request from 'supertest';
import { app, isSecureCookie } from './app';
import { pool } from './db';

beforeEach(() => {
  jest.resetAllMocks();
  jest.mocked(pool.query).mockResolvedValue({ rows: [] } as any);
  jest.mocked(pool.connect).mockResolvedValue({
    query: jest.fn().mockResolvedValue({ rows: [] }),
    release: jest.fn(),
  } as any);
});

describe('isSecureCookie', () => {
  it('returnerar true i production', () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const result = isSecureCookie();
    process.env.NODE_ENV = original;
    expect(result).toBe(true);
  });
});

describe('app routing', () => {
  it('exponerar GET /health', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
  });

  it('returnerar 503 när databasen är nere', async () => {
    jest.mocked(pool.query).mockRejectedValueOnce(new Error('connection refused'));

    const res = await request(app).get('/health');

    expect(res.status).toBe(503);
  });

  it('exponerar GET /recipes', async () => {
    const res = await request(app).get('/recipes');

    expect(res.status).toBe(200);
  });

  it('exponerar GET /shopping-lists', async () => {
    const res = await request(app).get('/shopping-lists');

    expect(res.status).toBe(200);
  });
});
