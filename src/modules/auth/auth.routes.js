import express from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  getProfile
} from './auth.controller.js';
import { validate } from '../../@core/middleware/validate.middleware.js';
import { authenticate } from '../../@core/middleware/auth.middleware.js';
import {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} from './auth.validation.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', validate(forgotPasswordValidation), forgotPassword);
router.post('/reset-password', validate(resetPasswordValidation), resetPassword);

// Protected routes
router.use(authenticate); // All routes below require authentication
router.get('/profile', getProfile);
router.post('/logout', logout);
router.post('/change-password', validate(changePasswordValidation), changePassword);

export default router;