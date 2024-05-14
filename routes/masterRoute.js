import express from "express";

const router = express.Router();
import {
  postMHead,
  getHead,
  postLedger,
} from "../controllers/masterHead.controller.js";

router.post("/masterHead", postMHead);
router.get("/getHead", getHead);
router.post("/postLedger", postLedger);

export default router;
