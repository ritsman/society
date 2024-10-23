import express from "express";
import {
  getBankPayment,
  getBankReceipt,
  getCashPayment,
  getCashReceipt,
  getOpeningBalance,
  getPaymentCollection,
  postBankPayment,
  postBankReceipt,
  postCashPayment,
  postCashReceipt,
  postOpeningBalance,
  postPaymentCollection,
  getAllPaymentCollection,
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

router.post("/postPaymentCollection" , postPaymentCollection)
router.get("/getPaymentCollection" ,getPaymentCollection )
router.get("/getAllpaymentCollection", getAllPaymentCollection);

export default router;
