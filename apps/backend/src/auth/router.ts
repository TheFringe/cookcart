import { Router } from 'express';
import passport from 'passport';

const router = Router();
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:4200';

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${CLIENT_URL}/login` }),
  (_req, res) => res.redirect(CLIENT_URL)
);

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.json({ ok: true });
  });
});

router.get('/me', (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Ej inloggad' });
    return;
  }
  res.json(req.user);
});

export default router;
