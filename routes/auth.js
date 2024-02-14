import express from 'express';
import {
  register,
  login,
  logout,
  // ForgotPassword,
  // resetPassword,
  // changePassword,
} from '../controllers/auth/auth.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
// router.post('/forgot', ForgotPassword);
// router.get('/reset/:id/:token', resetPassword);
// router.post('/reset/:id/:token', changePassword);

export default router;
