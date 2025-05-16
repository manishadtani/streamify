import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js'
import { generateStreamtoken } from '../controllers/chat.controller.js';


const router = express.Router()


router.put("/token", protectedRoute ,generateStreamtoken)


export default router;