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

const PgSession = connectPg(session);

export function isSecureCookie(): boolean {
  return process.env.NODE_ENV === 'production';
}

export const app = express();

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
  cookie: { secure: isSecureCookie(), maxAge: 30 * 24 * 60 * 60 * 1000 },
}) as unknown as RequestHandler);

app.use(passport.initialize() as unknown as RequestHandler);
app.use(passport.session() as unknown as RequestHandler);

app.use('/auth', authRouter);
app.use('/recipes', requireAuth, createRecipesRouter(new RecipeRepository(pool)));
