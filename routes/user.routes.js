import express from "express";
import { verifyToken} from "../middleware/auth.js";

import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.controller.js";


const userRouter = express.Router();

// READ
userRouter.get("/:id", verifyToken, getUser);
userRouter.get("/:id/friends", verifyToken, getUserFriends);

// UPDATE
userRouter.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default userRouter;