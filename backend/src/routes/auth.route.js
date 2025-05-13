import express from 'express'
const router = express.Router()
import { loginController, logoutController, onboardController, signupController } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

router.post("/signup", signupController)

router.post("/login", loginController)

router.post('/logout', logoutController)

router.post("/onboarding", protectedRoute, onboardController)


//check if user is loggedin
router.get("/me", protectedRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user })
})

export default router;