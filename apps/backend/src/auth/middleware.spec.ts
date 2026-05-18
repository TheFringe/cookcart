import { requireAuth } from './middleware';

describe('requireAuth', () => {
  it('skickar vidare autentiserade requests', () => {
    const req = { isAuthenticated: () => true } as any;
    const res = {} as any;
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('returnerar 401 för ej autentiserade requests', () => {
    const req = { isAuthenticated: () => false } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
