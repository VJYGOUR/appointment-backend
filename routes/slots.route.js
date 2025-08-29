import express from "express";
import getSlots from "../controllers/slots.controllers.js";
const router = express.Router();
router.get("/getSlots", getSlots);
export default router;
