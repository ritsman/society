import express from "express";
import {
  getBankPayment,
  getBankReceipt,
  getCashPayment,
  getCashReceipt,
  getOpeningBalance,
  postBankPayment,
  postBankReceipt,
  postCashPayment,
  postCashReceipt,
  postOpeningBalance,
} from "../controllers/Transaction.controller.js";

const router = express.Router();

router.post("/postBankReceipt", postBankReceipt);
router.get("/getBankReceipt", getBankReceipt);

router.post("/postCashReceipt", postCashReceipt);
router.get("/getCashReceipt", getCashReceipt);

router.post("/postBankPayment", postBankPayment);
router.get("/getBankPayment", getBankPayment);

router.post("/postCashpayment", postCashPayment);
router.get("/getCashPayment", getCashPayment);

router.post("/postOpeningBalance", postOpeningBalance);
router.get("/getOpeningBalance", getOpeningBalance);

export default router;
