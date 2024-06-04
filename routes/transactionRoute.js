import express from "express";
import {
  getBankReceipt,
  getCashReceipt,
  getOpeningBalance,
  postBankReceipt,
  postCashReceipt,
  postOpeningBalance,
} from "../controllers/Transaction.controller.js";

const router = express.Router();

router.post("/postBankReceipt", postBankReceipt);
router.get("/getBankReceipt", getBankReceipt);

router.post("/postCashReceipt", postCashReceipt);
router.get("/getCashReceipt", getCashReceipt);

router.post("/postOpeningBalance", postOpeningBalance);
router.get("/getOpeningBalance", getOpeningBalance);

export default router;
