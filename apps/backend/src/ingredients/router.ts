import { Router } from 'express';
import { IngredientRepository } from './ingredient.repository';

export function createIngredientsRouter(repo: IngredientRepository): Router {
  const router = Router();

  router.get('/', async (_req, res, next) => {
    try {
      const ingredients = await repo.findAll();
      res.json(ingredients);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
