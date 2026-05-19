import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { ShoppingListRepository } from './shopping-list.repository';

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler {
  return (req, res, next) => fn(req, res, next).catch(next);
}

export function createShoppingListsRouter(repo: ShoppingListRepository): Router {
  const router = Router();

  router.get('/', asyncHandler(async (_req, res) => {
    const lists = await repo.findAll();
    res.json(lists);
  }));

  router.post('/', asyncHandler(async (req, res) => {
    if (!req.body?.name) {
      res.status(400).json({ error: 'name krävs' });
      return;
    }
    const list = await repo.create(req.body);
    res.status(201).json(list);
  }));

  router.get('/:id', asyncHandler(async (req, res) => {
    const list = await repo.findById(Number(req.params.id));
    if (!list) {
      res.status(404).json({ error: 'Inköpslistan hittades inte' });
      return;
    }
    res.json(list);
  }));

  router.put('/:id', asyncHandler(async (req, res) => {
    const updated = await repo.update(Number(req.params.id), req.body);
    res.json(updated);
  }));

  router.delete('/:id', asyncHandler(async (req, res) => {
    await repo.remove(Number(req.params.id));
    res.status(204).send();
  }));

  router.post('/:id/items', asyncHandler(async (req, res) => {
    const item = await repo.addItem(Number(req.params.id), req.body);
    res.status(201).json(item);
  }));

  router.patch('/:id/items/:itemId', asyncHandler(async (req, res) => {
    const item = await repo.updateItem(Number(req.params.id), Number(req.params.itemId), req.body);
    res.json(item);
  }));

  router.delete('/:id/items/:itemId', asyncHandler(async (req, res) => {
    await repo.removeItem(Number(req.params.id), Number(req.params.itemId));
    res.status(204).send();
  }));

  return router;
}
