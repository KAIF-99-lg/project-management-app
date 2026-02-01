import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

router.post('/manager/login', (req, res) => {
  req.body.role = 'Manager';
  authController.login(req, res);
});

router.post('/manager/signup', (req, res) => {
  req.body.role = 'Manager';
  authController.signup(req, res);
});

router.post('/member/login', (req, res) => {
  req.body.role = 'Member';
  authController.login(req, res);
});

router.post('/member/signup', (req, res) => {
  req.body.role = 'Member';
  authController.signup(req, res);
});

export { router as authRoutes };