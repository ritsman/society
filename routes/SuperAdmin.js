import express from "express";
import { adminLogin, createSociety, getSociety, societyLogin } from "../controllers/SuperAdmin/admin.controller.js";

const router = express.Router();


router.post("/login",adminLogin)
router.post("/createSociety",createSociety)
router.get("/getSociety",getSociety)
router.post("/societyLogin",societyLogin)

export default router;
