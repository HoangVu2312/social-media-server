import express from "express";
const router = express.Router();


// AUTHENTICATION ROUTES
import authRouter from "./auth.routes.js"
router.use("/auth", authRouter);

// USER ROUTES
import userRouter from "./user.routes.js" 
router.use("/users", userRouter);

// POSTs
import postRouter from "./post.routes.js"
router.use("/posts", postRouter);


// test
import { register } from "../controllers/auth.controller.js";
router.post("/auth/register", register)

export default router;