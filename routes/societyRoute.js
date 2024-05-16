import express from "express";

const router = express.Router();

import { generateBills, getBill } from "../controllers/society.controller.js";

router.post("/postBills", generateBills);
router.get("/getBills", getBill);

export default router;
