import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { RecipeRepository } from './recipe.repository';
import { parseRecipeFromUrl } from './import';

const NOT_FOUND = { error: 'Receptet hittades inte' };
const NAME_REQUIRED = { error: 'name krävs' };
const INVALID_ID = { error: 'Ogiltigt id' };

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function parseId(param: string): number | null {
  const id = Number(param);
  return isNaN(id) ? null : id;
}

export function createRecipesRouter(repo: RecipeRepository): Router {
  const router = Router();

  router.get('/', asyncHandler(async (_req, res) => {
    const recipes = await repo.findAll();
    res.json(recipes);
  }));

  router.post('/import', asyncHandler(async (req, res) => {
    const { url } = req.body ?? {};
    if (!url) {
      res.status(400).json({ error: 'url krävs' });
      return;
    }
    try {
      const recipe = await parseRecipeFromUrl(url);
      res.json(recipe);
    } catch (err) {
      const isAxiosError = err && typeof err === 'object' && 'response' in err;
      if (isAxiosError) {
        res.status(502).json({ error: 'Kunde inte hämta sidan' });
      } else {
        res.status(422).json({ error: err instanceof Error ? err.message : 'Parsning misslyckades' });
      }
    }
  }));

  router.post('/', asyncHandler(async (req, res) => {
    if (!req.body?.name) {
      res.status(400).json(NAME_REQUIRED);
      return;
    }
    const body = {
      ...req.body,
      ingredients: (req.body.ingredients ?? []).map((ing: { name: string; quantity: string; unit: string }) => ({
        ...ing,
        quantity: ing.quantity !== '' && ing.quantity != null ? Number(ing.quantity) : null,
      })),
    };
    const recipe = await repo.create(body);
    res.status(201).json(recipe);
  }));

  router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) { res.status(400).json(INVALID_ID); return; }
    const recipe = await repo.findById(id);
    if (!recipe) {
      res.status(404).json(NOT_FOUND);
      return;
    }
    res.json(recipe);
  }));

  router.put('/:id', asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) { res.status(400).json(INVALID_ID); return; }
    if (!req.body?.name) {
      res.status(400).json(NAME_REQUIRED);
      return;
    }
    const recipe = await repo.update(id, req.body);
    if (!recipe) {
      res.status(404).json(NOT_FOUND);
      return;
    }
    res.json(recipe);
  }));

  router.delete('/:id', asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) { res.status(400).json(INVALID_ID); return; }
    const found = await repo.remove(id);
    if (!found) {
      res.status(404).json(NOT_FOUND);
      return;
    }
    res.status(204).send();
  }));

  router.get('/:id/cooking-progress', asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) { res.status(400).json(INVALID_ID); return; }
    const progress = await repo.findCookingProgress(id);
    res.json(progress);
  }));

  router.put('/:id/cooking-progress', asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) { res.status(400).json(INVALID_ID); return; }
    await repo.upsertCookingProgress(id, req.body);
    res.status(204).send();
  }));

  router.delete('/:id/cooking-progress', asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) { res.status(400).json(INVALID_ID); return; }
    await repo.clearCookingProgress(id);
    res.status(204).send();
  }));

  return router;
}
