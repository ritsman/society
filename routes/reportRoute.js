import express from "express";

const router = express.Router();
import { getSql } from "../controllers/report.controller.js";

router.get("/bills", getSql);

export default router;
