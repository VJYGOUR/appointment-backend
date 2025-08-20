import express from "express";
import {
  login,
  registerWithEmail,
  registerWithMobile,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/register/email", registerWithEmail);
router.post("/register/mobile", registerWithMobile);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);

// router.post("/logout", logout);
export default router;
