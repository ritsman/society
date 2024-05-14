import express from "express";

const router = express.Router();
import {
  postMHead,
  postGroup,
  getHead,
  getLedger,
  getGroupsList,
  postLedger,
} from "../controllers/masterHead.controller.js";

router.post("/masterHead", postMHead);
router.get("/getHead", getHead);
router.post("/postLedger", postLedger);
router.get("/getLedger", getLedger);
router.post("/postGroup", postGroup);
router.get("/getGroupsList", getGroupsList);

export default router;
