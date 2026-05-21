import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { MealPlanRepository } from './meal-plan.repository';

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler {
  return (req, res, next) => fn(req, res, next).catch(next);
}

export function createMealPlanRouter(repo: MealPlanRepository): Router {
  const router = Router();

  router.get('/', asyncHandler(async (req, res) => {
    if (req.query.month) {
      const entries = await repo.findByMonth(req.query.month as string);
      res.json(entries);
    } else {
      const entries = await repo.findByWeek(req.query.week as string);
      res.json(entries);
    }
  }));

  router.post('/', asyncHandler(async (req, res) => {
    const entry = await repo.create(req.body);
    res.status(201).json(entry);
  }));

  router.delete('/:id', asyncHandler(async (req, res) => {
    await repo.remove(Number(req.params.id));
    res.status(204).send();
  }));

  return router;
}
