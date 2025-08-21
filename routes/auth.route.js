import express from "express";
import {
  login,
  logout,
  registerWithEmail,
  registerWithMobile,
  verifyEmail,
} from "../controllers/auth.controllers.js";
const router = express.Router();
router.post("/register/email", registerWithEmail);
router.post("/register/mobile", registerWithMobile);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);

// router.post("/logout", logout);
export default router;
