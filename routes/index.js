import express from "express";

const router = express.Router();
import masterRoute from "./masterRoute.js";
import memberRoute from "./memberRoute.js";

router.use("/api/master", masterRoute);
router.use("/api/member", memberRoute);

export default router;
