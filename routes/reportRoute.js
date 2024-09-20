import express from "express";

const router = express.Router();
import { getSql ,postSendEmail} from "../controllers/report.controller.js";

router.get("/bills", getSql);
router.post("/send-email",postSendEmail)

export default router;
