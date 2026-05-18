jest.mock('./db', () => ({
  pool: { query: jest.fn().mockResolvedValue({ rows: [] }) },
}));
jest.mock('passport-google-oauth20', () => ({
  Strategy: jest.fn().mockImplementation(() => ({ name: 'google' })),
}));
jest.mock('connect-pg-simple', () => () => class {});
jest.mock('express-session', () => () => (req: any, _res: any, next: any) => {
  req.session = {};
  next();
});

import request from 'supertest';
import { app } from './app';

describe('app routing', () => {
  it('exponerar GET /recipes', async () => {
    const res = await request(app).get('/recipes');

    expect(res.status).toBe(200);
  });
});
