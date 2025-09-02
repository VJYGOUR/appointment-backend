import express from "express";
import { appointment } from "../controllers/appointment.controllers.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/create",protect, appointment 
);
export default router;
