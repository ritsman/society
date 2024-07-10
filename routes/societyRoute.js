import express from "express";

const router = express.Router();

import {
  BillAmounts,
  generateBills,
  getBill,
  getBillno,
  getGeneratedBills,
} from "../controllers/society.controller.js";

router.post("/postBills", BillAmounts);
router.get("/getBills", getBill);
router.get("/getBillNo", getBillno);

router.post("/generateBill", generateBills);
router.get("/getGeneratedBills", getGeneratedBills);

export default router;
