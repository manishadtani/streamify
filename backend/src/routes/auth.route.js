import express from 'express'
const router = express.Router()
import { loginController, logoutController, signupController } from '../controllers/auth.controller.js';

router.post("/signup", signupController)

router.post("/login", loginController)

router.post('/logout', logoutController)

export default router;