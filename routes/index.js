import express from "express";

const router = express.Router();
import masterRoute from "./masterRoute.js";
import memberRoute from "./memberRoute.js";
import societyRoute from "./societyRoute.js";

router.use("/api/master", masterRoute);
router.use("/api/member", memberRoute);
router.use("/api/society", societyRoute);

export default router;
