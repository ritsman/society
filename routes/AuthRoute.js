import express from "express";

const router = express.Router();
import {
  login,
  register,
  forgotPass,
  resetPass,
  getUsers,
  approveUser,
  rejectUser,
} from "../controllers/User.controller.js";

router.post("/login", login);
router.post("/register", register);
router.post("/forgotPassword", forgotPass);
router.post("/resetPassword/:token", resetPass);
router.get("/getAllUsers",getUsers)
router.post("/approve-user/:userId",approveUser);
router.delete("/remove-user/:userId",rejectUser);
export default router;
