import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js';
import { getMyFriends, getRecomendedUsers, sendFriendRequest,acceptFriendRequest, getFriendrequest, getOutgoingFriendrequest } from '../controllers/user.controller.js';
const router = express.Router()


// apply authmiddleware to all routes
router.use(protectedRoute)

router.get("/", getRecomendedUsers)
router.get("/friends", getMyFriends)

router.post("/friend-request/:id", sendFriendRequest)
router.put("/friend-request/:id/accept", acceptFriendRequest)

router.get("/friend-requests", getFriendrequest);
router.get("/outgoing-friend-requests", getOutgoingFriendrequest);


export default router;