import express from "express";
import { getFeedPosts, getUserPosts, likePost} from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/auth.js";

const postRouter = express.Router();


// READ
postRouter.get("/", verifyToken, getFeedPosts);
postRouter.get("/:userId/posts", verifyToken, getUserPosts);

// UPDATE
postRouter.patch("/:id/like", verifyToken, likePost);

export default postRouter;