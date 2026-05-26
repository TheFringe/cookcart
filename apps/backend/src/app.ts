import express, { type RequestHandler } from 'express';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import passport from 'passport';
import cors from 'cors';
import { pool } from './db';
import './auth/passport';
import authRouter from './auth/router';
import { requireAuth } from './auth/middleware';
import { RecipeRepository } from './recipes/recipe.repository';
import { createRecipesRouter } from './recipes/router';
import { ShoppingListRepository } from './shopping-lists/shopping-list.repository';
import { createShoppingListsRouter } from './shopping-lists/router';
import { IngredientRepository } from './ingredients/ingredient.repository';
import { createIngredientsRouter } from './ingredients/router';
import { MealPlanRepository } from './meal-plan/meal-plan.repository';
import { createMealPlanRouter } from './meal-plan/router';

const PgSession = connectPg(session);
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function isSecureCookie(): boolean {
  return process.env.NODE_ENV === 'production';
}

export const app = express();
app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:4200',
  credentials: true,
}) as RequestHandler);

app.use(express.json());

app.use(session({
  store: new PgSession({ pool, tableName: 'sessions', createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: isSecureCookie(), sameSite: isSecureCookie() ? 'none' : 'lax', maxAge: THIRTY_DAYS_MS },
}) as unknown as RequestHandler);

app.use(passport.initialize() as unknown as RequestHandler);
app.use(passport.session() as unknown as RequestHandler);

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'ok' });
  } catch {
    res.status(503).json({ status: 'error', db: 'error' });
  }
});

app.use('/auth', authRouter);
app.use('/recipes', requireAuth, createRecipesRouter(new RecipeRepository(pool)));
app.use('/shopping-lists', requireAuth, createShoppingListsRouter(new ShoppingListRepository(pool)));
app.use('/ingredients', requireAuth, createIngredientsRouter(new IngredientRepository(pool)));
app.use('/meal-plan', requireAuth, createMealPlanRouter(new MealPlanRepository(pool)));
