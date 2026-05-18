import express, { type RequestHandler } from 'express';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import passport from 'passport';
import cors from 'cors';
import { pool } from './db';
import './auth/passport';
import authRouter from './auth/router';

const PgSession = connectPg(session);
const app = express();
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

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
  cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 },
}) as unknown as RequestHandler);

app.use(passport.initialize() as unknown as RequestHandler);
app.use(passport.session() as unknown as RequestHandler);
app.use('/auth', authRouter);

app.get('/', (_req, res) => res.json({ message: 'Hello API' }));

app.listen(port, host, () => console.log(`[ ready ] http://${host}:${port}`));
