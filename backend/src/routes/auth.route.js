import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/signup", (req,res) => {
    res.send("Signup Page")
});

router.get("/signin", (req,res) => {
    res.send("Signin Page")
});

router.get("/Login", (req,res) => {
    res.send("Login Page")
});

export default router;