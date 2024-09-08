import express from "express";

const router = express.Router();

import {
  BillAmounts,
  deleteSocProfile,
  generateBills,
  getBill,
  getBillno,
  getGeneratedBills,
  getSocProfile,
  postSocProfile,
 
} from "../controllers/society.controller.js";

router.post("/postBills", BillAmounts);
router.get("/getBills", getBill);
router.get("/getBillNo", getBillno);

router.post("/generateBill", generateBills);
router.get("/getGeneratedBills", getGeneratedBills);

// society profile routes start

router.post("/postSocProfile" , postSocProfile)
router.get("/getSocProfile",getSocProfile)
router.delete("/deleteSocProfile/:registrationNumber", deleteSocProfile);
// society profile routes end

export default router;
