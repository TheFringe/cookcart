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
import { app, isSecureCookie } from './app';

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
  it('exponerar GET /recipes', async () => {
    const res = await request(app).get('/recipes');

    expect(res.status).toBe(200);
  });
});
