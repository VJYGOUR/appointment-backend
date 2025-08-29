import express from "express";
import {
  createProfile,
  getProfile,
} from "../controllers/profile.controllers.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/", protect, getProfile);
router.post("/create-profile", protect, createProfile);
export default router;
