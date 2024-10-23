import express from "express";

const router = express.Router();

import {
  BillAmounts,
  deleteBill,
  deleteSocProfile,
  generateBills,
  getBill,
  getBillno,
  getGeneratedBills,
  getSocProfile,
  postSocProfile,
  updatePrvDue,
  postBillCollection,
  getBillCollection
} from "../controllers/society.controller.js";
import {  failure, getTransactionList, payment, success } from "../controllers/Payment.controller.js";

router.post("/postBills", BillAmounts);
router.put("/update-prev-due", updatePrvDue);
router.get("/getBills", getBill);
router.get("/getBillNo", getBillno);

router.post("/generateBill", generateBills);
router.get("/getGeneratedBills", getGeneratedBills);
router.delete("/delete-GenBill",deleteBill);


// society profile routes start

router.post("/postSocProfile" , postSocProfile)
router.get("/getSocProfile",getSocProfile)
router.delete("/deleteSocProfile/:registrationNumber", deleteSocProfile);
// society profile routes end


// router.post("/create-order",createOrder);
// router.post("/capture-order",capturePayment);

router.post("/pay",payment);
router.post("/success",success);
router.post("/failure",failure)
router.get("/TransactionsList",getTransactionList);


router.post("/postBillCollection",postBillCollection)
router.get("/getBillCollection",getBillCollection)

export default router;
