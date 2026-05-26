import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../db';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.CALLBACK_URL ?? '/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const { rows } = await pool.query(
          `INSERT INTO users (google_id, email, name)
           VALUES ($1, $2, $3)
           ON CONFLICT (google_id) DO UPDATE SET name = $3
           RETURNING *`,
          [profile.id, profile.emails![0].value, profile.displayName]
        );
        done(null, rows[0]);
      } catch (err) {
        done(err as Error);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as { id: number }).id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, rows[0] ?? null);
  } catch (err) {
    done(err as Error);
  }
});
