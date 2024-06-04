import express from "express";

const router = express.Router();
import masterRoute from "./masterRoute.js";
import memberRoute from "./memberRoute.js";
import societyRoute from "./societyRoute.js";
import AuthRoute from "./AuthRoute.js";
import reportRoute from "./reportRoute.js";
import transactionRoute from "./transactionRoute.js";

router.use("/api/master", masterRoute);
router.use("/api/member", memberRoute);
router.use("/api/society", societyRoute);
router.use("/api/auth", AuthRoute);
router.use("/api/report", reportRoute);
router.use("/api/transaction", transactionRoute);

export default router;
