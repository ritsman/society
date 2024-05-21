import express from "express";

const router = express.Router();

import {
  generateBills,
  getBill,
  getBillno,
} from "../controllers/society.controller.js";

router.post("/postBills", generateBills);
router.get("/getBills", getBill);
router.get("/getBillNo", getBillno);

export default router;
