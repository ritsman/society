import express from "express";
import multer from "multer";

const router = express.Router();
import { Profile } from "../controllers/Member.controller.js";

let storage = multer.diskStorage({
  destination: "Assets/images",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let upload = multer({
  storage: storage,
});

router.post("/postProfile", upload.single("photo"), Profile);

export default router;
