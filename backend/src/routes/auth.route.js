import express from "express";
import dotenv from "dotenv";
import { signup, signin, login } from "../controllers/auth.controller.js";

dotenv.config();

const router = express.Router();

router.post("/signup", signup);

router.get("/signin", signin);

router.get("/Login", login);

export default router;